// @ts-ignore
/* eslint-disable */
import {$$$, formatPathVals, RequestType} from "./common";
import axios from "axios";
export const pet = {
    /**
     * Add a new pet to the store
     */
    addPet: $$$("/pet", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"]) {
            return axios.request<T['response']>({
                url,
                method,
                data:body,
            });
        }
    }),
    /**
     * Deletes a pet
     */
    deletePet: $$$("/pet/{petId}", "delete", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["petId"], params),
                method,
            });
        }
    }),
    /**
     * Finds Pets by status
     * @description Multiple status values can be provided with comma separated strings
     */
    findPetsByStatus: $$$("/pet/findByStatus", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["query"]) {
            return axios.request<T['response']>({
                url,
                method,
                params,
            });
        }
    }),
    /**
     * Finds Pets by tags
     * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     * @deprecated
     */
    findPetsByTags: $$$("/pet/findByTags", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["query"]) {
            return axios.request<T['response']>({
                url,
                method,
                params,
            });
        }
    }),
    /**
     * Find pet by ID
     * @description Returns a single pet
     */
    getPetById: $$$("/pet/{petId}", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["petId"], params),
                method,
            });
        }
    }),
    /**
     * Update an existing pet
     */
    updatePet: $$$("/pet", "put", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"]) {
            return axios.request<T['response']>({
                url,
                method,
                data:body,
            });
        }
    }),
    /**
     * Updates a pet in the store with form data
     */
    updatePetWithForm: $$$("/pet/{petId}", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], body: T["body"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["petId"], params),
                method,
                data:body,
            });
        }
    }),
    /**
     * uploads an image
     */
    uploadFile: $$$("/pet/{petId}/uploadImage", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], body: T["body"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["petId"], params),
                method,
                data:body,
            });
        }
    }),
};
export const store = {
    /**
     * Delete purchase order by ID
     * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
     */
    deleteOrder: $$$("/store/order/{orderId}", "delete", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["orderId"], params),
                method,
            });
        }
    }),
    /**
     * Returns pet inventories by status
     * @description Returns a map of status codes to quantities
     */
    getInventory: $$$("/store/inventory", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function () {
            return axios.request<T['response']>({
                url,
                method,
            });
        }
    }),
    /**
     * Find purchase order by ID
     * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
     */
    getOrderById: $$$("/store/order/{orderId}", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["orderId"], params),
                method,
            });
        }
    }),
    /**
     * Place an order for a pet
     */
    placeOrder: $$$("/store/order", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"]) {
            return axios.request<T['response']>({
                url,
                method,
                data:body,
            });
        }
    }),
};
export const user = {
    /**
     * Create user
     * @description This can only be done by the logged in user.
     */
    createUser: $$$("/user", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"]) {
            return axios.request<T['response']>({
                url,
                method,
                data:body,
            });
        }
    }),
    /**
     * Creates list of users with given input array
     */
    createUsersWithArrayInput: $$$("/user/createWithArray", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"]) {
            return axios.request<T['response']>({
                url,
                method,
                data:body,
            });
        }
    }),
    /**
     * Creates list of users with given input array
     */
    createUsersWithListInput: $$$("/user/createWithList", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"]) {
            return axios.request<T['response']>({
                url,
                method,
                data:body,
            });
        }
    }),
    /**
     * Delete user
     * @description This can only be done by the logged in user.
     */
    deleteUser: $$$("/user/{username}", "delete", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["username"], params),
                method,
            });
        }
    }),
    /**
     * Get user by user name
     */
    getUserByName: $$$("/user/{username}", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["username"], params),
                method,
            });
        }
    }),
    /**
     * Logs user into the system
     */
    loginUser: $$$("/user/login", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["query"]) {
            return axios.request<T['response']>({
                url,
                method,
                params,
            });
        }
    }),
    /**
     * Logs out current logged in user session
     */
    logoutUser: $$$("/user/logout", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function () {
            return axios.request<T['response']>({
                url,
                method,
            });
        }
    }),
    /**
     * Updated user
     * @description This can only be done by the logged in user.
     */
    updateUser: $$$("/user/{username}", "put", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], body: T["body"]) {
            return axios.request<T['response']>({
                url: formatPathVals(url, ["username"], params),
                method,
                data:body,
            });
        }
    }),
};
