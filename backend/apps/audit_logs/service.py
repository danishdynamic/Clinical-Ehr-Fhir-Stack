from apps.audit_logs.models import AuditLog


def create_audit_log(
    user,
    action,
    resource_type,
    resource_id,
    metadata=None,
):
    AuditLog.objects.create(
        user=user,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id),
        metadata=metadata or {},
    )