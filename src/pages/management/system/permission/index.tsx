import menuService from "@/api/services/menuService";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import Table, { type ColumnsType } from "antd/es/table";
import { isNil } from "ramda";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { MenuTree } from "#/entity";
import { BasicStatus, PermissionType } from "#/enum";

import PermissionModal, { type PermissionModalProps } from "./permission-modal";

const defaultPermissionValue: Omit<MenuTree, "id"> = {
	name: "",
	code: "",
	path: "",
	component: "",
	icon: "",
	status: BasicStatus.ENABLE,
	type: PermissionType.CATALOGUE,
	parentId: "",
	children: [],
};
export default function PermissionPage() {
	// const permissions = useUserPermission();

	const { t } = useTranslation();
	const { data: menus, refetch } = useQuery({
		queryKey: ["menu"],
		queryFn: menuService.getMenuTree,
	});
	// 删除请求
	const deleteMutation = useMutation({
		mutationFn: menuService.removeMenu,
	});
	const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps>({
		formValue: { ...defaultPermissionValue },
		title: "新建",
		show: false,
		onOk: () => {
			setPermissionModalProps((prev) => ({ ...prev, show: false }));
			refetch();
		},
		onCancel: () => {
			setPermissionModalProps((prev) => ({ ...prev, show: false }));
		},
		permissions: [],
	});
	const columns: ColumnsType<MenuTree> = [
		{
			title: "名称",
			dataIndex: "name",
			width: 300,
			render: (_, record) => <div>{t(record.name)}</div>,
		},
		{
			title: "类型",
			dataIndex: "type",
			width: 60,
			render: (_, record) => <Badge variant="info">{t(PermissionType[record.type])}</Badge>,
		},
		{
			title: "图标",
			dataIndex: "icon",
			width: 60,
			render: (icon: string) => {
				if (isNil(icon)) return "";
				if (icon.startsWith("ic")) {
					return <Icon icon={`local:${icon}`} size={18} className="ant-menu-item-icon" />;
				}
				return <Icon icon={icon} size={18} className="ant-menu-item-icon" />;
			},
		},
		{
			title: "组件",
			dataIndex: "component",
		},
		{
			title: "状态",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => <Badge variant={status === BasicStatus.DISABLE ? "error" : "success"}>{status === BasicStatus.DISABLE ? "禁用" : "启用"}</Badge>,
		},
		{ title: "排序", dataIndex: "sort", width: 60 },
		{
			title: "操作",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray">
					{(record?.type === PermissionType.CATALOGUE || record?.type === PermissionType.MENU) && (
						<Button variant="ghost" size="icon" onClick={() => onCreate(record.id)}>
							<Icon icon="gridicons:add-outline" size={18} />
						</Button>
					)}
					<Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
						<Icon icon="solar:pen-bold-duotone" size={18} />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => onRemove(record.id)}>
						<Icon icon="mingcute:delete-2-fill" size={18} className="text-error!" />
					</Button>
				</div>
			),
		},
	];

	const onCreate = (parentId?: string) => {
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			...defaultPermissionValue,
			title: "新建",
			formValue: { ...defaultPermissionValue, parent_id: parentId ?? null },
			permissions: menus || [],
		}));
	};

	const onEdit = (formValue: MenuTree) => {
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			title: "编辑",
			formValue,
			permissions: menus || [],
		}));
	};

	const onRemove = async (id: string) => {
		await deleteMutation.mutateAsync(Number(id));
		refetch();
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>权限列表</div>
					<Button onClick={() => onCreate()}>新建</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Table rowKey="id" size="small" scroll={{ x: "max-content" }} pagination={false} columns={columns} dataSource={menus} />
			</CardContent>
			<PermissionModal {...permissionModalProps} />
		</Card>
	);
}
