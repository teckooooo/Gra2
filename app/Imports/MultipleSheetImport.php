<?php

namespace App\Imports;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Collection;

class MultipleSheetImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            '*' => new class implements ToCollection {
                public function collection(Collection $rows)
                {
                    $sheetName = request()->input('sheet_name');

                    $tableName = 'sheet_' . strtolower(str_replace(' ', '_', $sheetName));
                    $header = $rows->first();

                    if (!Schema::hasTable($tableName)) {
                        Schema::create($tableName, function (Blueprint $table) use ($header) {
                            $table->id();
                            foreach ($header as $column) {
                                $name = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '_', $column));
                                $table->string($name)->nullable();
                            }
                            $table->timestamps();
                        });
                    }

                    foreach ($rows->skip(1) as $row) {
                        $data = [];
                        foreach ($header as $i => $column) {
                            $key = strtolower(preg_replace('/[^a-zA-Z0-9_]/', '_', $column));
                            $data[$key] = $row[$i] ?? null;
                        }

                        DB::table($tableName)->insert($data);
                    }
                }
            },
        ];
    }
}
