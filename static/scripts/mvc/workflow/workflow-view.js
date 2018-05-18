define("mvc/workflow/workflow-view",["exports","utils/localization","utils/utils","mvc/workflow/workflow-manager","mvc/workflow/workflow-canvas","mvc/workflow/workflow-node","mvc/workflow/workflow-icons","mvc/workflow/workflow-forms","mvc/ui/ui-misc","utils/async-save-text","libs/toastr","ui/editable-text"],function(o,e,t,i,a,n,s,l,r,d,w){"use strict";function f(o){return o&&o.__esModule?o:{default:o}}function c(o){var e=$("#galaxy_tools").contents();0===e.length&&(e=$(document),$(this).removeClass("search_active"),e.find(".toolTitle").removeClass("search_match"),e.find(".toolSectionBody").hide(),e.find(".toolTitle").show(),e.find(".toolPanelLabel").show(),e.find(".toolSectionWrapper").each(function(){"recently_used_wrapper"!==$(this).attr("id")?$(this).show():$(this).hasClass("user_pref_visible")&&$(this).show()}),e.find("#search-no-results").hide(),e.find("#search-spinner").hide(),o&&e.find("#tool-search-query").val("search tools"))}function u(o,e){var t=g.default[e];if(t){var i=$('<i class="icon fa">&nbsp;</i>').addClass(t);o.before(i)}}Object.defineProperty(o,"__esModule",{value:!0});var h=f(e),p=f(t),v=f(i),m=f(a),k=f(n),g=f(s),y=f(l),b=f(r),x=f(d);!function(o){if(o&&o.__esModule)return o;var e={};if(null!=o)for(var t in o)Object.prototype.hasOwnProperty.call(o,t)&&(e[t]=o[t]);e.default=o}(w);window.workflow_globals=window.workflow_globals||{},o.default=Backbone.View.extend({initialize:function(o){function e(){$.jStorage.set("overview-off",!1),$("#overview-border").css("right","0px"),$("#close-viewport").css("background-position","0px 0px")}function t(){$.jStorage.set("overview-off",!0),$("#overview-border").css("right","20000px"),$("#close-viewport").css("background-position","12px 0px")}var i=window.workflow_globals.app=this;this.options=o,this.urls=o&&o.urls||{};var a=function(o,e){if(show_message("Saving workflow","progress"),i.workflow.check_changes_in_active_form(),!i.workflow.has_changes)return hide_modal(),void(e&&e());i.workflow.rectify_workflow_outputs(),p.default.request({url:Galaxy.root+"api/workflows/"+i.options.id,type:"PUT",data:{workflow:i.workflow.to_simple()},success:function(o){var t=$("<div/>").text(o.message);if(o.errors){t.addClass("warningmark");var a=$("<ul/>");$.each(o.errors,function(o,e){$("<li/>").text(e).appendTo(a)}),t.append(a)}else t.addClass("donemark");i.workflow.name=o.name,i.workflow.has_changes=!1,i.workflow.stored=!0,i.showWorkflowParameters(),o.errors?window.show_modal("Saving workflow",t,{Ok:hide_modal}):(e&&e(),hide_modal())},error:function(o){window.show_modal("Saving workflow failed.",o.err_msg,{Ok:hide_modal})}})};$("#tool-search-query").click(function(){$(this).focus(),$(this).select()}).keyup(function(){if($(this).css("font-style","normal"),this.value.length<3)c(!1);else if(this.value!=this.lastValue){$(this).addClass("search_active");var o=this.value;this.timer&&clearTimeout(this.timer),$("#search-spinner").show(),this.timer=setTimeout(function(){$.get(i.urls.tool_search,{q:o},function(o){if($("#search-no-results").hide(),$(".toolSectionWrapper").hide(),$(".toolSectionWrapper").find(".toolTitle").hide(),0!=o.length){var e=$.map(o,function(o,e){return"link-"+o});$(e).each(function(o,e){$("[id='"+e+"']").parent().addClass("search_match"),$("[id='"+e+"']").parent().show().parent().parent().show().parent().show()}),$(".toolPanelLabel").each(function(){for(var o=$(this),e=o.next(),t=!0;0!==e.length&&e.hasClass("toolTitle");){if(e.is(":visible")){t=!1;break}e=e.next()}t&&o.hide()})}else $("#search-no-results").show();$("#search-spinner").hide()},"json")},400)}this.lastValue=this.value}),this.canvas_manager=window.workflow_globals.canvas_manager=new m.default(this,$("#canvas-viewport"),$("#overview")),this.reset(),this.datatypes=JSON.parse($.ajax({url:Galaxy.root+"api/datatypes",async:!1}).responseText),this.datatypes_mapping=JSON.parse($.ajax({url:Galaxy.root+"api/datatypes/mapping",async:!1}).responseText),this.ext_to_type=this.datatypes_mapping.ext_to_class_name,this.type_to_type=this.datatypes_mapping.class_to_classes,this._workflowLoadAjax(i.options.id,{success:function(o){i.reset(),i.workflow.from_simple(o,!0),i.workflow.has_changes=!1,i.workflow.fit_canvas_to_nodes(),i.scroll_to_nodes(),i.canvas_manager.draw_overview();var e="";_.each(o.steps,function(t,a){var n="";t.errors&&(n+="<li>"+t.errors+"</li>"),_.each(o.upgrade_messages[a],function(o){n+="<li>"+o+"</li>"}),n&&(e+="<li>Step "+(parseInt(a,10)+1)+": "+i.workflow.nodes[a].name+"<ul>"+n+"</ul></li>")}),e?window.show_modal("Issues loading this workflow","Please review the following issues, possibly resulting from tool upgrades or changes.<p><ul>"+e+"</ul></p>",{Continue:hide_modal}):hide_modal(),i.showWorkflowParameters()},beforeSubmit:function(o){show_message("Loading workflow","progress")}}),window.make_popupmenu&&make_popupmenu($("#workflow-options-button"),{Save:a,"Save As":function(){var o=$('<form><label style="display:inline-block; width: 100%;">Save as name: </label><input type="text" id="workflow_rename" style="width: 80%;" autofocus/><br><label style="display:inline-block; width: 100%;">Annotation: </label><input type="text" id="wf_annotation" style="width: 80%;" /></form>');window.show_modal("Save As a New Workflow",o,{OK:function(){var o=$("#workflow_rename").val().length>0?$("#workflow_rename").val():"SavedAs_"+i.workflow.name,e=$("#wf_annotation").val().length>0?$("#wf_annotation").val():"";$.ajax({url:i.urls.workflow_save_as,type:"POST",data:{workflow_name:o,workflow_annotation:e,workflow_data:function(){return JSON.stringify(i.workflow.to_simple())}}}).done(function(o){window.onbeforeunload=void 0,window.location=Galaxy.root+"workflow/editor?id="+o,hide_modal()}).fail(function(){hide_modal(),alert("Saving this workflow failed. Please contact this site's administrator.")})},Cancel:hide_modal})},Run:function(){window.location=Galaxy.root+"workflows/run?id="+i.options.id},"Edit Attributes":function(){i.workflow.clear_active_node()},"Auto Re-layout":function(){i.workflow.layout(),i.workflow.fit_canvas_to_nodes(),i.scroll_to_nodes(),i.canvas_manager.draw_overview()},Close:function(){if(i.workflow.check_changes_in_active_form(),workflow&&i.workflow.has_changes){var o=function(){window.onbeforeunload=void 0,window.document.location=i.urls.workflow_index};window.show_modal("Close workflow editor","There are unsaved changes to your workflow which will be lost.",{Cancel:hide_modal,"Save Changes":function(){a(null,o)}},{"Don't Save":o})}else window.document.location=i.urls.workflow_index}});var n=$.jStorage.get("overview-size");void 0!==n&&$("#overview-border").css({width:n,height:n}),$.jStorage.get("overview-off")?t():e(),$("#overview-border").bind("dragend",function(o,e){var t=$(this).offsetParent(),i=t.offset(),a=Math.max(t.width()-(e.offsetX-i.left),t.height()-(e.offsetY-i.top));$.jStorage.set("overview-size",a+"px")}),$("#close-viewport").click(function(){"0px"===$("#overview-border").css("right")?t():e()}),window.onbeforeunload=function(){if(workflow&&i.workflow.has_changes)return"There are unsaved changes to your workflow which will be lost."},this.options.workflows.length>0&&$("#left").find(".toolMenu").append(this._buildToolPanelWorkflows()),$("div.toolSectionBody").hide(),$("div.toolSectionTitle > span").wrap("<a href='#'></a>");var s=null;$("div.toolSectionTitle").each(function(){var o=$(this).next("div.toolSectionBody");$(this).click(function(){o.is(":hidden")?(s&&s.slideUp("fast"),s=o,o.slideDown("fast")):(o.slideUp("fast"),s=null)})}),(0,x.default)("workflow-name","workflow-name",i.urls.rename_async,"new_name"),$("#workflow-tag").click(function(){return $(".tag-area").click(),!1}),(0,x.default)("workflow-annotation","workflow-annotation",i.urls.annotate_async,"new_annotation",25,!0,4)},_buildToolPanelWorkflows:function(){var o=this,e=$('<div class="toolSectionWrapper"><div class="toolSectionTitle"><a href="#"><span>Workflows</span></a></div><div class="toolSectionBody"><div class="toolSectionBg"/></div></div>');return _.each(this.options.workflows,function(t){if(t.id!==o.options.id){var i=new b.default.ButtonIcon({icon:"fa fa-copy",cls:"ui-button-icon-plain",tooltip:(0,h.default)("Copy and insert individual steps"),onclick:function(){t.step_count<2?o.copy_into_workflow(t.id,t.name):Galaxy.modal.show({title:(0,h.default)("Warning"),body:"This will copy "+t.step_count+" new steps into your workflow.",buttons:{Cancel:function(){Galaxy.modal.hide()},Copy:function(){Galaxy.modal.hide(),o.copy_into_workflow(t.id,t.name)}}})}}),a=$("<a/>").attr("href","#").html(t.name).on("click",function(){o.add_node_for_subworkflow(t.latest_id,t.name)});e.find(".toolSectionBg").append($("<div/>").addClass("toolTitle").append(a).append(i.$el))}}),e},copy_into_workflow:function(o){var e=this;this._workflowLoadAjax(o,{success:function(o){e.workflow.from_simple(o,!1);var t="";$.each(o.upgrade_messages,function(o,i){t+="<li>Step "+(parseInt(o,10)+1)+": "+e.workflow.nodes[o].name+"<ul>",$.each(i,function(o,e){t+="<li>"+e+"</li>"}),t+="</ul></li>"}),t?window.show_modal("Subworkflow embedded with changes","Problems were encountered loading this workflow (possibly a result of tool upgrades). Please review the following parameters and then save.<ul>"+t+"</ul>",{Continue:hide_modal}):hide_modal()},beforeSubmit:function(o){show_message("Importing workflow","progress")}})},reset:function(){this.workflow&&this.workflow.remove_all(),this.workflow=window.workflow_globals.workflow=new v.default(this,$("#canvas-container"))},scroll_to_nodes:function(){var o,e,t=$("#canvas-viewport"),i=$("#canvas-container");e=i.width()<t.width()?(t.width()-i.width())/2:0,o=i.height()<t.height()?(t.height()-i.height())/2:0,i.css({left:e,top:o})},_workflowLoadAjax:function(o,e){$.ajax(p.default.merge(e,{url:this.urls.load_workflow,data:{id:o,_:"true"},dataType:"json",cache:!1}))},_moduleInitAjax:function(o,e){var t=this;p.default.request({type:"POST",url:Galaxy.root+"api/workflows/build_module",data:e,success:function(e){o.init_field_data(e),o.update_field_data(e),t.workflow.activate_node(o)}})},add_node_for_tool:function(o,e){var t=this.workflow.create_node("tool",e,o);this._moduleInitAjax(t,{type:"tool",tool_id:o,_:"true"})},add_node_for_subworkflow:function(o,e){var t=this.workflow.create_node("subworkflow",e,o);this._moduleInitAjax(t,{type:"subworkflow",content_id:o,_:"true"})},add_node_for_module:function(o,e){var t=this.workflow.create_node(o,e);this._moduleInitAjax(t,{type:o,_:"true"})},display_file_list:function(o){var e="<select id='node_data_list' name='node_data_list'>";for(var t in o.output_terminals)e+="<option value='"+t+"'>"+t+"</option>";return e+="</select>"},showWorkflowParameters:function(){var o=/\$\{.+?\}/g,e=[],t=$("#workflow-parameters-container"),i=$("#workflow-parameters-box"),a="",n=[];$.each(this.workflow.nodes,function(t,i){i.config_form&&i.config_form.inputs&&p.default.deepeach(i.config_form.inputs,function(e){if("string"==typeof e.value){var t=e.value.match(o);t&&(n=n.concat(t))}}),i.post_job_actions&&$.each(i.post_job_actions,function(e,t){t.action_arguments&&$.each(t.action_arguments,function(e,t){var i=t.match(o);i&&(n=n.concat(i))})}),n&&$.each(n,function(o,t){-1===$.inArray(t,e)&&e.push(t)})}),e&&0!==e.length?($.each(e,function(o,e){a+="<div>"+e.substring(2,e.length-1)+"</div>"}),t.html(a),i.show()):(t.html(a),i.hide())},showAttributes:function(){$(".right-content").hide(),$("#edit-attributes").show()},showForm:function(o,e){var t="right-content",i=t+"-"+e.id,a=$("#"+t);if(o&&0==a.find("#"+i).length){var n=$('<div id="'+i+'" class="'+t+'"/>');if(o.node=e,o.workflow=this.workflow,o.datatypes=this.datatypes,o.icon=g.default[e.type],o.cls="ui-portlet-narrow",e){var s="tool"==e.type?"Tool":"Default";n.append(new y.default[s](o).form.$el),a.append(n)}else Galaxy.emit.debug("workflow-view::initialize()","Node not found in workflow.")}$("."+t).hide(),a.find("#"+i).show(),a.show(),a.scrollTop()},isSubType:function(o,e){return o=this.ext_to_type[o],e=this.ext_to_type[e],this.type_to_type[o]&&e in this.type_to_type[o]},prebuildNode:function(o,e,t){var i=this,a=$("<div class='toolForm toolFormInCanvas'/>"),n=$("<div class='toolFormTitle unselectable'><span class='nodeTitle'>"+e+"</div></div>");u(n.find(".nodeTitle"),o),a.append(n),a.css("left",$(window).scrollLeft()+20),a.css("top",$(window).scrollTop()+20),a.append($("<div class='toolFormBody'></div>"));var s=new k.default(this,{element:a});s.type=o,s.content_id=t;var l="<div><img height='16' align='middle' src='"+Galaxy.root+"static/images/loading_small_white_bg.gif'/> loading tool info...</div>";a.find(".toolFormBody").append(l);var r=$("<div class='buttons' style='float: right;'></div>");"subworkflow"!==o&&r.append($("<div/>").addClass("fa-icon-button fa fa-files-o").click(function(o){s.clone()})),r.append($("<div/>").addClass("fa-icon-button fa fa-times").click(function(o){s.destroy()})),a.appendTo("#canvas-container");var d=$("#canvas-container").position(),w=$("#canvas-container").parent(),f=a.width(),c=a.height();return a.css({left:-d.left+w.width()/2-f/2,top:-d.top+w.height()/2-c/2}),r.prependTo(a.find(".toolFormTitle")),f+=r.width()+10,a.css("width",f),a.bind("dragstart",function(){i.workflow.activate_node(s)}).bind("dragend",function(){i.workflow.node_changed(this),i.workflow.fit_canvas_to_nodes(),i.canvas_manager.draw_overview()}).bind("dragclickonly",function(){i.workflow.activate_node(s)}).bind("drag",function(o,e){var t=$(this).offsetParent().offset(),i=e.offsetX-t.left,a=e.offsetY-t.top;$(this).css({left:i,top:a}),$(this).find(".terminal").each(function(){this.terminal.redraw()})}),s}})});
//# sourceMappingURL=../../../maps/mvc/workflow/workflow-view.js.map