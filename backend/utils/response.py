from rest_framework.response import Response
from rest_framework import status


def api_response(
    success,
    message="",
    data=None,
    errors=None,
    status_code=status.HTTP_200_OK,
):
    response = {
        "success": success,
        "data": data,
    }
    if message:
        response["message"] = message
    if errors is not None:
        response["errors"] = errors

    return Response(response, status=status_code)
