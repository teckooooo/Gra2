<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
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

        foreach ($spreadsheet->getSheetNames() as $sheetName) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            $data = $sheet->toArray();

            if (empty($data) || count($data) < 2) continue;

            $tableName = 'sheet_' . Str::slug($sheetName, '_');
            $headers = $data[0];

            // Filtrar columnas vacías del encabezado
            $validHeaders = [];
            foreach ($headers as $index => $header) {
                $column = Str::slug($header, '_');
                if (!empty($column)) {
                    $validHeaders[$index] = $column;
                }
            }

            if (empty($validHeaders)) continue;

            // Crear tabla si no existe
            if (!Schema::hasTable($tableName)) {
                Schema::create($tableName, function (Blueprint $table) use ($validHeaders) {
                    $table->id();
                    foreach ($validHeaders as $column) {
                        $table->text($column)->nullable();
                    }
                    $table->timestamps();
                });
            }

            // Insertar filas
            $rows = array_slice($data, 1);
            foreach ($rows as $row) {
                $rowData = [];
                $rowIsEmpty = true; // Marcar si la fila está vacía

                foreach ($validHeaders as $i => $column) {
                    $value = $row[$i] ?? null;

                    if ($value !== null && $value !== '') {
                        $rowIsEmpty = false; // Hay al menos un valor no vacío

                        // --- Solo intentar formatear si es número mayor a 25569 (01/01/1970 en Excel) ---
                        if (is_numeric($value) && $value > 25569 && $value < 60000) {
                            try {
                                $fecha = ExcelDate::excelToDateTimeObject($value);
                                if ($fecha) {
                                    $value = $fecha->format('d/m/Y');
                                }
                            } catch (\Exception $e) {
                                // No hacer nada si no es fecha válida
                            }
                        } else {
                            // Si es un texto que parece fecha tipo "2025-04-28"
                            if (is_string($value)) {
                                try {
                                    $fechaTexto = Carbon::parse($value);
                                    if ($fechaTexto && $fechaTexto->year > 1900) {
                                        $value = $fechaTexto->format('d/m/Y');
                                    }
                                } catch (\Exception $e) {
                                    // No hacer nada si no es fecha de texto válida
                                }
                            }
                        }
                    }

                    $rowData[$column] = $value;
                }

                // Insertar solo si la fila no está vacía
                if (!$rowIsEmpty) {
                    DB::table($tableName)->insert($rowData);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Excel importado con éxito.'
        ]);
    }
}
