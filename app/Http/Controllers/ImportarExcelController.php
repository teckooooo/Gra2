<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ImportarExcelController extends Controller
{
    public function importar(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls'
        ]);

        $file = $request->file('file');
        $reader = new Xlsx();
        $spreadsheet = $reader->load($file->getRealPath());

        $incidenciasUnicas = [];

        foreach ($spreadsheet->getSheetNames() as $sheetName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();

            // Leer encabezados (fila 1)
            $headersRow = [];
            for ($col = 'A'; $col <= $highestColumn; $col++) {
                $header = $sheet->getCell($col . '1')->getValue(); // valor plano
                $slug = Str::slug($header, '_');
                if (!empty($slug)) {
                    $headersRow[$col] = $slug;
                }
            }

            if (empty($headersRow)) continue;

            $tableName = 'sheet_' . Str::slug($sheetName, '_');

            // Crear tabla si no existe
            if (!Schema::hasTable($tableName)) {
                Schema::create($tableName, function (Blueprint $table) use ($headersRow) {
                    $table->id();
                    foreach ($headersRow as $column) {
                        $table->text($column)->nullable();
                    }
                    $table->timestamps();
                });
            }

            // Leer e insertar filas desde fila 2
            for ($row = 2; $row <= $highestRow; $row++) {
                $rowData = [];
                $rowIsEmpty = true;

                foreach ($headersRow as $col => $columnName) {
                    $cell = $sheet->getCell($col . $row);
                    $cellValue = $cell->getValue(); // valor crudo

                    if ($cellValue !== null && $cellValue !== '') {
                        $rowIsEmpty = false;

                        // Solo si es columna de fecha y el valor parece serial
                        if (Str::contains($columnName, 'fecha') && is_numeric($cellValue) && $cellValue > 25000 && $cellValue < 60000) {
                            try {
                                $fecha = ExcelDate::excelToDateTimeObject($cellValue);
                                $cellValue = $fecha->format('d/m/Y');
                            } catch (\Exception $e) {}
                        } elseif (is_string($cellValue)) {
                            // Solo reemplazar guiones si es texto
                            $cellValue = str_replace('-', '/', $cellValue);
                        }

                        // Capitalizar valores de columna incidencia
                        if (Str::contains($columnName, 'incidencia')) {
                            $cellValue = ucfirst(trim($cellValue));
                            $incidenciasUnicas[] = $cellValue;
                        }
                    }

                    $rowData[$columnName] = $cellValue;
                }

                if (!$rowIsEmpty) {
                    DB::table($tableName)->insert($rowData);
                }
            }
        }

        // Crear tabla 'incidence' si no existe
        if (!Schema::hasTable('incidence')) {
            Schema::create('incidence', function (Blueprint $table) {
                $table->id();
                $table->string('nombre')->unique();
                $table->timestamps();
            });
        }

        // Insertar incidencias únicas
        $incidenciasUnicas = array_unique(array_filter($incidenciasUnicas));
        foreach ($incidenciasUnicas as $nombre) {
            DB::table('incidence')->updateOrInsert(['nombre' => $nombre]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Excel importado con éxito. Fechas corregidas y tabla de incidencias creada.'
        ]);
    }
}
