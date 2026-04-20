const FaresReducer = (state, action) => {

    switch (action.type) {
        case "GET_PACKAGES_START":
            return {
                packages: [],
                isFetching: true,
                error: false
            }
        case "GET_PACKAGES_SUCCESS":
            return {
                packages: action.payload,
                isFetching: false,
                error: false
            }
        case "GET_PACKAGES_FAILURE":
            return {
                packages: [],
                isFetching: false,
                error: true
            }
        case "CREATE_PACKAGES_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "CREATE_PACKAGES_SUCCESS":
            return {
                packages: [...state.packages, action.payload], // add new packages to array
                isFetching: false,
                error: false,
            }
        case "CREATE_PACKAGES_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "UPDATE_PACKAGES_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "UPDATE_PACKAGES_SUCCESS":
            return {
                packages: state.packages.map((packages) =>
                    packages._id === action.payload._id ? action.payload : packages
                ),
                isFetching: false,
                error: false,
            };

        case "UPDATE_PACKAGES_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        case "DELETE_PACKAGES_START":
            return {
                ...state,
                isFetching: true,
                error: false
            }
        case "DELETE_PACKAGES_SUCCESS":
            return {
                ...state,
                packages: state.packages.filter(
                    (pkg) => String(pkg._id) !== String(action.payload)
                ),
                isFetching: false,
                error: false,
            };
        case "DELETE_PACKAGES_FAILURE":
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return { ...state }

    }
}


export default FaresReducer