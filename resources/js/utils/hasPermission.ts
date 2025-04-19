export function hasPermission(
    permissions: string[] | undefined,
    permissionToCheck: string
): boolean {
    if (!permissions || !Array.isArray(permissions)) return false;
    return permissions.includes(permissionToCheck);
}
