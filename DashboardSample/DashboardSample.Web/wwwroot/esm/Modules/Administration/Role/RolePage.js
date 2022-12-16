import{a as x}from"../../../_chunks/chunk-7S36WDRD.js";import{e as h,f,g as P,h as o,i as a}from"../../../_chunks/chunk-ZS6WTEOZ.js";import{a as S}from"../../../_chunks/chunk-G2ZJWO4O.js";import{a as s,b as n,c as p,e as R,f as g}from"../../../_chunks/chunk-K3EI6ARL.js";var I=n(R(),1);var b=n(g(),1),e=n(R(),1);var l=class extends b.TemplatedDialog{constructor(t){super(t);this.permissions=new x(this.byId("Permissions"),{showRevoke:!1}),P.List({RoleID:this.options.roleID,Module:null,Submodule:null},y=>{this.permissions.value=y.Entities.map(m=>({PermissionKey:m}))}),this.permissions.implicitPermissions=(0,e.getRemoteData)("Administration.ImplicitPermissions")}getDialogOptions(){let t=super.getDialogOptions();return t.buttons=[{text:(0,e.text)("Dialogs.OkButton"),click:y=>{P.Update({RoleID:this.options.roleID,Permissions:this.permissions.value.map(m=>m.PermissionKey),Module:null,Submodule:null},m=>{this.dialogClose(),window.setTimeout(()=>(0,e.notifySuccess)((0,e.text)("Site.RolePermissionDialog.SaveSuccess")),0)})}},{text:(0,e.text)("Dialogs.CancelButton"),click:()=>this.dialogClose()}],t.title=(0,e.format)((0,e.text)("Site.RolePermissionDialog.DialogTitle"),this.options.title),t}getTemplate(){return'<div id="~_Permissions"></div>'}};s(l,"RolePermissionDialog");var c=n(g(),1);var w="edit-permissions",r=class extends c.EntityDialog{constructor(){super(...arguments);this.form=new f(this.idPrefix)}getFormKey(){return f.formKey}getIdProperty(){return o.idProperty}getLocalTextPrefix(){return o.localTextPrefix}getNameProperty(){return o.nameProperty}getService(){return a.baseUrl}getToolbarButtons(){let t=super.getToolbarButtons();return t.push({title:S.Site.RolePermissionDialog.EditButton,cssClass:w,icon:"fa-lock text-green",onClick:()=>{new l({roleID:this.entity.RoleId,title:this.entity.RoleName}).dialogOpen()}}),t}updateInterface(){super.updateInterface(),this.toolbar.findButton(w).toggleClass("disabled",this.isNewOrDeleted())}};s(r,"RoleDialog"),r=p([c.Decorators.registerClass("DashboardSample.Administration.RoleDialog")],r);var d=n(g(),1);var i=class extends d.EntityGrid{getColumnsKey(){return h.columnsKey}getDialogType(){return r}getIdProperty(){return o.idProperty}getLocalTextPrefix(){return o.localTextPrefix}getService(){return a.baseUrl}constructor(u){super(u)}getDefaultSortBy(){return[o.Fields.RoleName]}};s(i,"RoleGrid"),i=p([d.Decorators.registerClass("DashboardSample.Administration.RoleGrid")],i);$(function(){(0,I.initFullHeightGridPage)(new i($("#GridDiv")).element)});
//# sourceMappingURL=RolePage.js.map
