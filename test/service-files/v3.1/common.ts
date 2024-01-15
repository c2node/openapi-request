// @ts-ignore
/* eslint-disable */
import type {
    ErrorResponse,
    SuccessResponse,
    FilterKeys,
    MediaType,
    ResponseObjectMap,
    OperationRequestBodyContent,
} from "openapi-typescript-helpers";
/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/pet/{petId}/uploadImage": {
    /** uploads an image */
    post: operations["uploadFile"];
  };
  "/pet": {
    /** Update an existing pet */
    put: operations["updatePet"];
    /** Add a new pet to the store */
    post: operations["addPet"];
  };
  "/pet/findByStatus": {
    /**
     * Finds Pets by status
     * @description Multiple status values can be provided with comma separated strings
     */
    get: operations["findPetsByStatus"];
  };
  "/pet/findByTags": {
    /**
     * Finds Pets by tags
     * @deprecated
     * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     */
    get: operations["findPetsByTags"];
  };
  "/pet/{petId}": {
    /**
     * Find pet by ID
     * @description Returns a single pet
     */
    get: operations["getPetById"];
    /** Updates a pet in the store with form data */
    post: operations["updatePetWithForm"];
    /** Deletes a pet */
    delete: operations["deletePet"];
  };
  "/store/order": {
    /** Place an order for a pet */
    post: operations["placeOrder"];
  };
  "/store/order/{orderId}": {
    /**
     * Find purchase order by ID
     * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
     */
    get: operations["getOrderById"];
    /**
     * Delete purchase order by ID
     * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
     */
    delete: operations["deleteOrder"];
  };
  "/store/inventory": {
    /**
     * Returns pet inventories by status
     * @description Returns a map of status codes to quantities
     */
    get: operations["getInventory"];
  };
  "/user/createWithArray": {
    /** Creates list of users with given input array */
    post: operations["createUsersWithArrayInput"];
  };
  "/user/createWithList": {
    /** Creates list of users with given input array */
    post: operations["createUsersWithListInput"];
  };
  "/user/{username}": {
    /** Get user by user name */
    get: operations["getUserByName"];
    /**
     * Updated user
     * @description This can only be done by the logged in user.
     */
    put: operations["updateUser"];
    /**
     * Delete user
     * @description This can only be done by the logged in user.
     */
    delete: operations["deleteUser"];
  };
  "/user/login": {
    /** Logs user into the system */
    get: operations["loginUser"];
  };
  "/user/logout": {
    /** Logs out current logged in user session */
    get: operations["logoutUser"];
  };
  "/user": {
    /**
     * Create user
     * @description This can only be done by the logged in user.
     */
    post: operations["createUser"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    UserArray: components["schemas"]["User"][];
    User: {
      /** Format: int64 */
      id?: number;
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      phone?: string;
      /**
       * Format: int32
       * @description User Status
       */
      userStatus?: number;
    };
    Order: {
      /** Format: int64 */
      id?: number;
      /** Format: int64 */
      petId?: number;
      /** Format: int32 */
      quantity?: number;
      /** Format: date-time */
      shipDate?: string;
      /**
       * @description Order Status
       * @enum {string}
       */
      status?: "placed" | "approved" | "delivered";
      complete?: boolean;
    };
    Tag: {
      /** Format: int64 */
      id?: number;
      name?: string;
    };
    Pet: {
      /** Format: int64 */
      id?: number;
      category?: components["schemas"]["Category"];
      name: string;
      photoUrls: string[];
      tags?: components["schemas"]["Tag"][];
      /**
       * @description pet status in the store
       * @enum {string}
       */
      status?: "available" | "pending" | "sold";
    };
    Category: {
      /** Format: int64 */
      id?: number;
      name?: string;
    };
    ApiResponse: {
      /** Format: int32 */
      code?: number;
      type?: string;
      message?: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** uploads an image */
  uploadFile: {
    parameters: {
      path: {
        /**
         * @description ID of pet to update
         * @example
         */
        petId: number;
      };
    };
    requestBody?: {
      content: {
        "multipart/form-data": {
          /** @description Additional data to pass to server */
          additionalMetadata?: string;
          /**
           * Format: binary
           * @description file to upload
           */
          file?: string;
        };
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["ApiResponse"];
        };
      };
    };
  };
  /** Update an existing pet */
  updatePet: {
    requestBody?: {
      content: {
        /** @example */
        "application/json": components["schemas"]["Pet"];
      };
    };
    responses: {
      /** @description Invalid ID supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Pet not found */
      404: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Validation exception */
      405: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Add a new pet to the store */
  addPet: {
    requestBody?: {
      content: {
        /** @example */
        "application/json": components["schemas"]["Pet"];
      };
    };
    responses: {
      /** @description Invalid input */
      405: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Finds Pets by status
   * @description Multiple status values can be provided with comma separated strings
   */
  findPetsByStatus: {
    parameters: {
      query: {
        /** @description Status values that need to be considered for filter */
        status: string[];
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["Pet"][];
        };
      };
      /** @description Invalid status value */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Finds Pets by tags
   * @deprecated
   * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   */
  findPetsByTags: {
    parameters: {
      query: {
        /** @description Tags to filter by */
        tags: string[];
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["Pet"][];
        };
      };
      /** @description Invalid tag value */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Find pet by ID
   * @description Returns a single pet
   */
  getPetById: {
    parameters: {
      path: {
        /**
         * @description ID of pet to return
         * @example
         */
        petId: number;
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["Pet"];
        };
      };
      /** @description Invalid ID supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Pet not found */
      404: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Updates a pet in the store with form data */
  updatePetWithForm: {
    parameters: {
      path: {
        /**
         * @description ID of pet that needs to be updated
         * @example
         */
        petId: number;
      };
    };
    requestBody?: {
      content: {
        "application/x-www-form-urlencoded": {
          /** @description Updated name of the pet */
          name?: string;
          /** @description Updated status of the pet */
          status?: string;
        };
      };
    };
    responses: {
      /** @description Invalid input */
      405: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Deletes a pet */
  deletePet: {
    parameters: {
      header?: {
        /** @example */
        api_key?: string;
      };
      path: {
        /**
         * @description Pet id to delete
         * @example
         */
        petId: number;
      };
    };
    responses: {
      /** @description Invalid ID supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Pet not found */
      404: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Place an order for a pet */
  placeOrder: {
    requestBody?: {
      content: {
        /** @example */
        "application/json": components["schemas"]["Order"];
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["Order"];
        };
      };
      /** @description Invalid Order */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Find purchase order by ID
   * @description For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
   */
  getOrderById: {
    parameters: {
      path: {
        /**
         * @description ID of pet that needs to be fetched
         * @example
         */
        orderId: number;
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["Order"];
        };
      };
      /** @description Invalid ID supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Order not found */
      404: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Delete purchase order by ID
   * @description For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
   */
  deleteOrder: {
    parameters: {
      path: {
        /**
         * @description ID of the order that needs to be deleted
         * @example
         */
        orderId: number;
      };
    };
    responses: {
      /** @description Invalid ID supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Order not found */
      404: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Returns pet inventories by status
   * @description Returns a map of status codes to quantities
   */
  getInventory: {
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": {
            [key: string]: number;
          };
        };
      };
    };
  };
  /** Creates list of users with given input array */
  createUsersWithArrayInput: {
    requestBody?: {
      content: {
        /** @example */
        "application/json": components["schemas"]["UserArray"];
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Creates list of users with given input array */
  createUsersWithListInput: {
    requestBody?: {
      content: {
        /** @example */
        "application/json": components["schemas"]["UserArray"];
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Get user by user name */
  getUserByName: {
    parameters: {
      path: {
        /**
         * @description The name that needs to be fetched. Use user1 for testing.
         * @example
         */
        username: string;
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description Invalid username supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description User not found */
      404: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Updated user
   * @description This can only be done by the logged in user.
   */
  updateUser: {
    parameters: {
      path: {
        /**
         * @description name that need to be updated
         * @example
         */
        username: string;
      };
    };
    requestBody?: {
      content: {
        /** @example */
        "application/json": components["schemas"]["User"];
      };
    };
    responses: {
      /** @description Invalid user supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description User not found */
      404: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Delete user
   * @description This can only be done by the logged in user.
   */
  deleteUser: {
    parameters: {
      path: {
        /**
         * @description The name that needs to be deleted
         * @example
         */
        username: string;
      };
    };
    responses: {
      /** @description Invalid username supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description User not found */
      404: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Logs user into the system */
  loginUser: {
    parameters: {
      query: {
        /** @description The user name for login */
        username: string;
        /** @description The password for login in clear text */
        password: string;
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": string;
        };
      };
      /** @description Invalid username/password supplied */
      400: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** Logs out current logged in user session */
  logoutUser: {
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /**
   * Create user
   * @description This can only be done by the logged in user.
   */
  createUser: {
    requestBody?: {
      content: {
        /** @example */
        "application/json": components["schemas"]["User"];
      };
    };
    responses: {
      /** @description successful operation */
      200: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
}

export type FetchResponse<T> =
    FilterKeys<SuccessResponse<ResponseObjectMap<T>>, MediaType>
    | FilterKeys<ErrorResponse<ResponseObjectMap<T>>, MediaType>;
type PickType<T, K extends string> = T extends { [key in K]: any }
    ? T[K]
    : never;
export type RequestType<P extends keyof paths,
    M extends keyof paths[P], Request extends paths[P][M] = paths[P][M], Params extends PickType<Request, 'parameters'> = PickType<Request, 'parameters'>> = {
    path: PickType<Params, 'path'>,
    query: PickType<Params, 'query'>,
    header: PickType<Params, 'header'>,
    cookie: PickType<Params, 'cookie'>,
    body: OperationRequestBodyContent<Request>,
    response: FetchResponse<Request>
};
// 生成请求方法
export function $$$<
    P extends keyof paths,
    M extends keyof paths[P],
    Fn extends (url: P, method: M) => any
>(url: P, method: M, fn: Fn): ReturnType<Fn> {
    return fn(url, method)
}
// 格式化url路径中的变量
export function formatPathVals(urlPath: string, keys: string[], vals: Record<string, string | number | (string | number)[]>) {
    return keys.length ? keys.reduce((str, key) => {
        let val = vals[key];
        if (Array.isArray(val)) {
            val = val.join(',')
        }
        delete vals[key];
        return str.replace(new RegExp("{?}".replace("?",key), 'g'), "" + val);
    }, urlPath) : urlPath
}
// 添加header头
export function setHeader(header: Headers, keys: string[], vals: Record<string, string | number | (string | number)[]>, isCookie = false) {
    return keys.length ? keys.reduce((h, key) => {
        let val = vals[key];
        if (Array.isArray(val)) {
            val.forEach(v => {
                const _v = encodeURIComponent(v);
                isCookie ? h.getSetCookie().push(`${key}=${_v}`) : h.append(key, `${_v}`);
            });
        } else {
            const _v = encodeURIComponent(val);
            isCookie ? h.getSetCookie().push(`${key}=${_v}`) : h.append(key, `${_v}`);
        }
        delete vals[key];
        return h;
    }, header) : header
}