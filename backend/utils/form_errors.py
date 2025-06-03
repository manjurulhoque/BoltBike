def readable_form_errors(form):
    errors = form.errors
    if not errors:
        return None
    field_errors = {}
    for field, errors in errors.items():
        field_name = field if field != "__all__" else "nonFieldErrors"
        field_errors[field_name] = [str(e) for e in errors]
    return field_errors
