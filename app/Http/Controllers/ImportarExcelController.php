<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use Illuminate\Support\Str;

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
                foreach ($validHeaders as $i => $column) {
                    $rowData[$column] = $row[$i] ?? null;
                }
                DB::table($tableName)->insert($rowData);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Excel importado con éxito.'
        ]);
    }
}
