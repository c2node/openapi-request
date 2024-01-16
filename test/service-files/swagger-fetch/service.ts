// @ts-ignore
/* eslint-disable */
import {$$$, formatPathVals, setHeader, RequestType} from "./common";
import {request,RequestOption} from "../../fetch-request";
export const pet = {
    /**
     * Add a new pet to the store
     */
    addPet: $$$("/pet", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
            return request<T['response']>({
                url,
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
            }, option);
        }
    }),
    /**
     * Deletes a pet
     */
    deletePet: $$$("/pet/{petId}", "delete", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["header"] & T["path"], option?: RequestOption) {
			const headers = new Headers();
			setHeader(headers, ["api_key"], params, false);
            return request<T['response']>({
                url: formatPathVals(url, ["petId"], params),
                method,
                headers: Object.fromEntries(Object.entries(headers)),
            }, option);
        }
    }),
    /**
     * Finds Pets by status
     * @description Multiple status values can be provided with comma separated strings
     */
    findPetsByStatus: $$$("/pet/findByStatus", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["query"], option?: RequestOption) {
            return request<T['response']>({
                url,
                method,
                params,
                responseType: "json",
            }, option);
        }
    }),
    /**
     * Finds Pets by tags
     * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     * @deprecated
     */
    findPetsByTags: $$$("/pet/findByTags", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["query"], option?: RequestOption) {
            return request<T['response']>({
                url,
                method,
                params,
                responseType: "json",
            }, option);
        }
    }),
    /**
     * Find pet by ID
     * @description Returns a single pet
     */
    getPetById: $$$("/pet/{petId}", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], option?: RequestOption) {
            return request<T['response']>({
                url: formatPathVals(url, ["petId"], params),
                method,
                responseType: "json",
            }, option);
        }
    }),
    /**
     * Update an existing pet
     */
    updatePet: $$$("/pet", "put", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
            return request<T['response']>({
                url,
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
            }, option);
        }
    }),
    /**
     * Updates a pet in the store with form data
     */
    updatePetWithForm: $$$("/pet/{petId}", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "application/x-www-form-urlencoded");
            return request<T['response']>({
                url: formatPathVals(url, ["petId"], params),
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
            }, option);
        }
    }),
    /**
     * uploads an image
     */
    uploadFile: $$$("/pet/{petId}/uploadImage", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "multipart/form-data");
            return request<T['response']>({
                url: formatPathVals(url, ["petId"], params),
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
                responseType: "json",
            }, option);
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
        return function (params: T["path"], option?: RequestOption) {
            return request<T['response']>({
                url: formatPathVals(url, ["orderId"], params),
                method,
            }, option);
        }
    }),
    /**
     * Find purchase order by ID
     * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
     */
    getOrderById: $$$("/store/order/{orderId}", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], option?: RequestOption) {
            return request<T['response']>({
                url: formatPathVals(url, ["orderId"], params),
                method,
                responseType: "json",
            }, option);
        }
    }),
    /**
     * Place an order for a pet
     */
    placeOrder: $$$("/store/order", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
            return request<T['response']>({
                url,
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
                responseType: "json",
            }, option);
        }
    }),
};
export const system = {
    /**
     * Get user by user name
     */
    userInfo: $$$("/user/{username}", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], option?: RequestOption) {
            return request<T['response']>({
                url: formatPathVals(url, ["username"], params),
                method,
                responseType: "json",
            }, option);
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
        return function (body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
            return request<T['response']>({
                url,
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
            }, option);
        }
    }),
    /**
     * Creates list of users with given input array
     */
    createUsersWithArrayInput: $$$("/user/createWithArray", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
            return request<T['response']>({
                url,
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
            }, option);
        }
    }),
    /**
     * Creates list of users with given input array
     */
    createUsersWithListInput: $$$("/user/createWithList", "post", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
            return request<T['response']>({
                url,
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
            }, option);
        }
    }),
    /**
     * Delete user
     * @description This can only be done by the logged in user.
     */
    deleteUser: $$$("/user/{username}", "delete", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], option?: RequestOption) {
            return request<T['response']>({
                url: formatPathVals(url, ["username"], params),
                method,
            }, option);
        }
    }),
    /**
     * Logs user into the system
     */
    loginUser: $$$("/user/login", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["query"], option?: RequestOption) {
            return request<T['response']>({
                url,
                method,
                params,
                responseType: "json",
            }, option);
        }
    }),
    /**
     * Logs out current logged in user session
     */
    logoutUser: $$$("/user/logout", "get", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (option?: RequestOption) {
            return request<T['response']>({
                url,
                method,
            }, option);
        }
    }),
    /**
     * Updated user
     * @description This can only be done by the logged in user.
     */
    updateUser: $$$("/user/{username}", "put", (url, method) => {
        type T = RequestType<typeof url, typeof method>;
        return function (params: T["path"], body: T["body"], option?: RequestOption) {
			const headers = new Headers();
			headers.append("Content-Type", "application/json");
            return request<T['response']>({
                url: formatPathVals(url, ["username"], params),
                method,
                data: body,
                headers: Object.fromEntries(Object.entries(headers)),
            }, option);
        }
    }),
};
