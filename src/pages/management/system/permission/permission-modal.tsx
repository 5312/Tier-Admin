import menuService from "@/api/services/menuService";
// import { useUserPermission } from "@/store/userStore";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/ui/form";
import { Input } from "@/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group";
import { useMutation } from "@tanstack/react-query";
import { AutoComplete, TreeSelect } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Menu, MenuTree } from "#/entity";
import { BasicStatus, PermissionType } from "#/enum";

// Constants
const ENTRY_PATH = "/src/pages";
const PAGES = import.meta.glob("/src/pages/**/*.tsx");
const PAGE_SELECT_OPTIONS = Object.entries(PAGES).map(([path]) => {
	const pagePath = path.replace(ENTRY_PATH, "");
	return {
		label: pagePath,
		value: pagePath,
	};
});

export type PermissionModalProps = {
	formValue: Omit<Menu, "id">;
	title: string;
	show: boolean;
	onOk: (values: Menu) => void;
	onCancel: VoidFunction;
	permissions: MenuTree[];
};

export default function PermissionModal({ title, show, formValue, onOk, onCancel, permissions }: PermissionModalProps) {
	const form = useForm<Menu>({
		defaultValues: {
			...formValue,
			icon: formValue.icon || "",
		},
	});

	const [compOptions, setCompOptions] = useState(PAGE_SELECT_OPTIONS);

	const getParentNameById = useCallback(
		(parentId: string, data: MenuTree[] | undefined = permissions) => {
			let name = "";
			if (!data || !parentId) return name;
			for (let i = 0; i < data.length; i += 1) {
				if (data[i].id === parentId) {
					name = data[i].name;
				} else if (data[i].children) {
					name = getParentNameById(parentId, data[i].children);
				}
				if (name) {
					break;
				}
			}
			return name;
		},
		[permissions],
	);

	const updateCompOptions = useCallback((name: string) => {
		if (!name) return;
		setCompOptions(
			PAGE_SELECT_OPTIONS.filter((path) => {
				return path.value.includes(name.toLowerCase());
			}),
		);
	}, []);

	useEffect(() => {
		form.reset(formValue);
		if (formValue.parentId) {
			const parentName = getParentNameById(formValue.parentId);
			updateCompOptions(parentName);
		}
	}, [formValue, form, getParentNameById, updateCompOptions]);

	const onSubmit = async (values: Menu) => {
		if (values.id) {
			await modifyMutation.mutateAsync(values);
		} else {
			await createMutation.mutateAsync(values);
		}

		onOk(values);
	};

	const modifyMutation = useMutation({
		mutationFn: menuService.updateMenu,
	});
	const createMutation = useMutation({
		mutationFn: menuService.createMenu,
	});

	return (
		<Dialog open={show} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<p id="permission-modal-description" className="sr-only">
						权限管理表单
					</p>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>类型</FormLabel>
									<FormControl>
										<ToggleGroup
											type="single"
											variant="outline"
											className="w-auto"
											value={String(field.value)}
											onValueChange={(value) => {
												if (value !== "") {
													field.onChange(Number(value));
												}
											}}
										>
											<ToggleGroupItem value={String(PermissionType.CATALOGUE)}>目录</ToggleGroupItem>
											<ToggleGroupItem value={String(PermissionType.MENU)}>菜单</ToggleGroupItem>
										</ToggleGroup>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>名称</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="parentId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>父级</FormLabel>
									<FormControl>
										<TreeSelect
											fieldNames={{
												label: "name", // 修改为显示 name 而不是 path
												value: "id",
												children: "children",
											}}
											allowClear
											treeData={permissions}
											value={field.value || undefined} // 处理 null/undefined 情况
											onSelect={(value, node) => {
												field.onChange(value);
												if (node?.name) {
													updateCompOptions(node.name);
												}
											}}
											onChange={(value) => {
												field.onChange(value || null); // 处理清除操作
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="path"
							render={({ field }) => (
								<FormItem>
									<FormLabel>路由</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						{form.watch("type") === PermissionType.MENU && (
							<FormField
								control={form.control}
								name="component"
								render={({ field }) => (
									<FormItem>
										<FormLabel>组件</FormLabel>
										<FormControl>
											<AutoComplete
												options={compOptions}
												filterOption={(input, option) => {
													if (!option) return false;
													const label = option.label as string;
													return label.toLowerCase().includes(input.toLowerCase());
												}}
												value={field.value || undefined}
												onChange={(value) => field.onChange(value || null)}
												placeholder="请选择组件路径"
												allowClear
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>图标</FormLabel>
									<FormControl>
										<Input {...field} value={String(field.value || "")} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="hidden"
							render={({ field }) => (
								<FormItem>
									<FormLabel>隐藏</FormLabel>
									<FormControl>
										<ToggleGroup
											type="single"
											variant="outline"
											value={String(!!field.value)}
											onValueChange={(value) => {
												field.onChange(Boolean(value));
											}}
										>
											<ToggleGroupItem value="false">显示</ToggleGroupItem>
											<ToggleGroupItem value="true">隐藏</ToggleGroupItem>
										</ToggleGroup>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sort"
							render={({ field }) => (
								<FormItem>
									<FormLabel>排序</FormLabel>
									<FormControl>
										<Input
											type="number"
											value={field.value}
											onChange={(v) => {
												const val = v.target.value;
												field.onChange(val === "" ? undefined : Number(val));
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>状态</FormLabel>
									<FormControl>
										<ToggleGroup
											type="single"
											variant="outline"
											value={String(field.value)}
											onValueChange={(value) => {
												field.onChange(Number(value));
											}}
										>
											<ToggleGroupItem value={String(BasicStatus.ENABLE)}>启用</ToggleGroupItem>
											<ToggleGroupItem value={String(BasicStatus.DISABLE)}>禁用</ToggleGroupItem>
										</ToggleGroup>
									</FormControl>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button variant="outline" onClick={onCancel}>
								取消
							</Button>
							<Button type="submit" variant="default">
								确认
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
