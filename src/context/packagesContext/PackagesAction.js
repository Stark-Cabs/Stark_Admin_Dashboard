export const getPackagesStart = () => ({
    type: 'GET_PACKAGES_START'
})

export const getPackagesSuccess = (packages) => ({
    type: 'GET_PACKAGES_SUCCESS',
    payload: packages
})

export const getPackagesFailure = () => ({
    type: 'GET_PACKAGES_FAILURE'
})

export const createPackagesStart = () => ({
    type: 'CREATE_PACKAGES_START'
})

export const createPackagesSuccess = (packages) => ({
    type: 'CREATE_PACKAGES_SUCCESS',
    payload: packages
})

export const createPackagesFailure = () => ({
    type: 'CREATE_PACKAGES_FAILURE'
})

export const updatePackagesStart = () => ({
    type: 'UPDATE_PACKAGES_START'
})

export const updatePackagesSuccess = (packages) => ({
    type: 'UPDATE_PACKAGES_SUCCESS',
    payload: packages
})

export const updatePackagesFailure = () => ({
    type: 'UPDATE_PACKAGES_FAILURE'
})

export const deletePackagesStart = () => ({
    type: 'DELETE_PACKAGES_START'
})

export const deletePackagesSuccess = (id) => ({
    type: 'DELETE_PACKAGES_SUCCESS',
    payload: id
})

export const deletePackagesFailure = () => ({
    type: 'DELETE_PACKAGES_FAILURE'
})
