import {useCallback, useEffect, useState} from "react";
import dishRepository from "../repository/dishRepository.js";

const initialState = {
    dishes: [],
    loading: true,
};

const useDishes = () => {
    const [state, setState] = useState(initialState);

    const fetchDishes = useCallback(() => {
        setState({
            dishes: [],
            loading: true,
        });
        dishRepository
            .findAll()
            .then((response) => {
                setState({
                    dishes: response.data,
                    loading: false,
                });
            });
    }, []);

    const onAdd = useCallback((data) => {
        dishRepository
            .add(data)
            .then(() => fetchDishes())
            .catch((error) => console.log(error));
    }, [fetchDishes]);

    const onEdit = useCallback((id, data) => {
        dishRepository
            .edit(id, data)
            .then(() => fetchDishes())
            .catch((error) => console.log(error));
    }, [fetchDishes]);

    const onDelete = useCallback((id) => {
        dishRepository
            .delete(id)
            .then(() => fetchDishes())
            .catch((error) => console.log(error));
    }, [fetchDishes]);

    useEffect(() => {
        fetchDishes();
    }, [fetchDishes]);

    return {...state, onAdd, onEdit, onDelete};
};

export default useDishes;