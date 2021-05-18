from fastapi import APIRouter, status

from backend.utils import get_cities, get_cars

router = APIRouter()


@router.get(
    "/cities/",
    responses={
        status.HTTP_200_OK: {
            "description": "Getting a list of cities in the system.",
            "content": {
                "application/json": {
                    "example": ['Москва', 'Челябинск', '...']
                }
            },
        },
    }
)
def get_cities_list() -> list:
    """Получение списка городов."""
    return get_cities()


@router.get(
    "/cars/",
    responses={
        status.HTTP_200_OK: {
            "description": "Getting a list of cars in the system.",
            "content": {
                "application/json": {
                    "example": {
                        "Alfa": [
                              "Alfa Romeo 4C",
                              "Alfa Romeo 6C",
                        ]
                    }
                }
            },
        },
    }
)
def get_cars_list() -> dict:
    """Получение списка марок и моделей автомобилей."""
    return get_cars()
