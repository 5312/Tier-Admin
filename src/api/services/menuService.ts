import apiClient from "../apiClient";

import type { Menu, Permission_Old } from "#/entity";

export enum MenuApi {
	Menu = "/menu",
	Tree = "/v1/menu/tree",
}

const getMenuList = () => apiClient.get<Menu[]>({ url: MenuApi.Menu });

const getMenuTree = () => apiClient.get<Permission_Old[]>({ url: MenuApi.Tree });

export default {
	getMenuList,
	getMenuTree,
};
