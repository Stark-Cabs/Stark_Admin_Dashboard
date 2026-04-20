import axiosInstance from "../../api/axiosInstance";
import { createPackagesFailure, createPackagesStart, createPackagesSuccess, deletePackagesFailure, deletePackagesStart, deletePackagesSuccess, getPackagesFailure, getPackagesStart, getPackagesSuccess, updatePackagesFailure, updatePackagesStart, updatePackagesSuccess } from "./PackagesAction";

export const getPackages = async (dispatch, toast) => {
    dispatch(getPackagesStart());
    try {
        const res = await axiosInstance.get(`/packages/admin/get-all-packages`);
        console.log(res.data.data)
        dispatch(getPackagesSuccess(res.data.data));
        toast.success("Package Details Fetched Successfully!");
    } catch (error) {
        console.error("Failed to fetch package details:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch package");
        dispatch(getPackagesFailure());
    }
}
export const createPackage = async (dispatch, toast, data, setShowModal) => {
    dispatch(createPackagesStart());
    try {
        const res = await axiosInstance.post(`/packages`, data);
        console.log(res.data.data)
        dispatch(createPackagesSuccess(res.data.data));
        toast.success("Package Details Created Successfully!");
        setShowModal(false)
    } catch (error) {
        console.error("Failed to create package details:", error);
        toast.error(error?.response?.data?.message || "Failed to create package");
        dispatch(createPackagesFailure());
        setShowModal(false)
    }
}
export const updatePackage = async (dispatch, toast, data, setShowModal, id) => {
    dispatch(updatePackagesStart());
    try {
        const res = await axiosInstance.put(`/packages/${id}`, data);
        console.log(res.data.data)
        dispatch(updatePackagesSuccess(res.data.data));
        toast.success("Package Details Updated Successfully!");
        setShowModal(false)
    } catch (error) {
        console.error("Failed to update package details:", error);
        toast.error(error?.response?.data?.message || "Failed to update packages");
        dispatch(updatePackagesFailure());
        setShowModal(false)
    }
}

export const deletePackage = async (dispatch, toast, data, setShowModal, id) => {
    dispatch(deletePackagesStart());
    try {
        const res = await axiosInstance.delete(`/packages/${id}`);
        console.log(res.data.data)
        dispatch(deletePackagesSuccess(id));
        toast.success("Package Details Deleted Successfully!");
        setShowModal(false)
    } catch (error) {
        console.error("Failed to deleted package details:", error);
        toast.error(error?.response?.data?.message || "Deleted to update packages");
        dispatch(deletePackagesFailure());
        setShowModal(false)
    }
}