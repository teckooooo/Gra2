namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permiso extends SpatiePermission
{
    protected $table = 'permissions';
}
