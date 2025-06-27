import apiClient from "../apiClient";

import type { Menu, MenuTree } from "#/entity";

export enum MenuApi {
	Menu = "/menu",
	Tree = "/v1/menu/tree",
	Remove = "/v1/menu/delete",
	Create = "/v1/menu/create",
	Update = "/v1/menu/update",
}

const getMenuList = () => apiClient.get<Menu[]>({ url: MenuApi.Menu });

const getMenuTree = () => apiClient.get<MenuTree[]>({ url: MenuApi.Tree });

const removeMenu = (id: number) => apiClient.delete({ url: `${MenuApi.Remove}/${id}` });
const createMenu = (data: Menu) => apiClient.post({ url: MenuApi.Create, data });
const updateMenu = (data: Menu) => apiClient.put({ url: `${MenuApi.Update}/${data.id}`, data });
export default {
	getMenuList,
	getMenuTree,
	removeMenu,
	createMenu,
	updateMenu,
};
