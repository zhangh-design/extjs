Ext.override(Ext.form.TextField, {
	style : 'margin:0',
	setValue : function(v){
		if(typeof v =='string')
			v = v.replace(/<br>/g, '\n');
		Ext.form.TextField.superclass.setValue.call(this, v);
	},
	anchor : '100%',
      getErrors : function(value) {
        var errors = Ext.form.TextField.superclass.getErrors.apply(this, arguments);

        value = value || this.processValue(this.getRawValue());

        if (Ext.isFunction(this.validator)) {
          var msg = this.validator(value);
          if (msg !== true) {
            errors.push(msg);
          }
        }

        if (value.length < 1 || value === this.emptyText) {
          if (this.allowBlank) {
            this.clearInvalid();
            return true;
          } else {
            errors.push(this.blankText);
          }
        }

        if (value.length < this.minLength) {
          errors.push(String.format(this.minLengthText, this.minLength));
        }

        if (value.length > this.maxLength) {
          errors.push(String.format(this.maxLengthText, this.maxLength));
        }
        if (this.vtype) {
          var vt = Ext.form.VTypes;
          if (!vt[this.vtype](value, this)) {
            errors.push(this.vtypeText || vt[this.vtype + 'Text']);
          }
        }

        if (this.regex && !this.regex.test(value)) {
          errors.push(this.regexText);
        }

        return errors;
      }
    });
 Ext.override(Ext.data.Connection,{
 	timeout : 30000000
 });
Ext.override(Ext.form.BasicForm,{
 	reset : function(){
 		if(this.items.items){
 			Ext.each(this.items.items,function(f){
 				f.setValue("");
 			});
 		}else{
 			this.items.each(function(f){
	            f.reset();
	        });
 		}
        return this;
    }
 });
Ext.override(Ext.form.Field,{
 	readonlyClass : 'x-form-readonly',
 	setAllowBlank : function(allowBlank){
 		this.allowBlank = allowBlank;
 		if(!allowBlank&&this.label&&!Ext.isEmpty(this.label.dom.innerHTML)){
 			this.label.dom.innerHTML = "<font color=#ff00c2>"+this.label.dom.innerHTML.replace("<font color=red>*</font>","")+"</font>";
 		}
 	},
 	onRender : function(ct, position){
        if(!this.el){
            var cfg = this.getAutoCreate();

            if(!cfg.name){
                cfg.name = this.name || this.id;
            }
            if(this.inputType){
                cfg.type = this.inputType;
            }
            this.autoEl = cfg;
        }
        Ext.form.Field.superclass.onRender.call(this, ct, position);
        if(this.submitValue === false){
            this.el.dom.removeAttribute('name');
        }
        var type = this.el.dom.type;
        if(type){
            if(type == 'password'){
                type = 'text';
            }
            this.el.addClass('x-form-'+type);
        }
        this.el.addClass([this.fieldClass, this.cls]);
        if(this.readOnly){
            this.setReadOnly(true);
        }
        if(this.tabIndex !== undefined){
            this.el.dom.setAttribute('tabIndex', this.tabIndex);
        }
    },
 	setReadOnly : function(readOnly){
        if(this.rendered){Ext.form.ComboBox
            this.el.dom.readOnly = readOnly;
        }
        this.readOnly = readOnly;
        if(readOnly)
        	if(this.el)
        		this.el.addClass(this.readonlyClass);
        	else 
        		this.addClass(this.readonlyClass);
        else
        	if(this.el)
        		this.el.removeClass(this.readonlyClass);
        	else
        		this.removeClass(this.readonlyClass);
    }
 });
 Ext.override(Ext.form.TriggerField,{
 	readonlyClass : 'x-form-readonly',
 	setReadOnly: function(readOnly){
        if(readOnly != this.readOnly){
            this.readOnly = readOnly;
            this.updateEditState();
        }
        if(readOnly)
        	if(this.el)
        		this.el.addClass(this.readonlyClass);
        	else
        		this.addClass(this.readonlyClass);
        else
        	if(this.el)
        		this.el.removeClass(this.readonlyClass);
        	else
        		this.removeClass(this.readonlyClass);
    }
 });
 Ext.override(Ext.data.JsonReader,{
 	buildExtractors : function() {
        if(this.ef){
            return;
        }
        var s = this.meta, Record = this.recordType,
            f = Record.prototype.fields, fi = f.items, fl = f.length;

        if(s.totalProperty) {
            this.getTotal = this.createAccessor(s.totalProperty);
        }
        if(s.successProperty) {
            this.getSuccess = this.createAccessor(s.successProperty);
        }
        if (s.messageProperty) {
            this.getMessage = this.createAccessor(s.messageProperty);
        }
        this.getRoot = s.root ? this.createAccessor(s.root) : function(p){return p;};
        if (s.id || s.idProperty) {
            var g = this.createAccessor(s.id || s.idProperty);
            this.getId = function(rec) {
                //var r = g(rec);
                //return (r === undefined || r === '') ? null : r;
                return null;
            };
        } else {
            this.getId = function(){return null;};
        }
        var ef = [];
        for(var i = 0; i < fl; i++){
            f = fi[i];
            var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
            ef.push(this.createAccessor(map));
        }
        this.ef = ef;
    }
});
Ext.override(Ext.grid.RowSelectionModel,{
	selectNext : function(keepExisting){
		this.grid.focus();
		this.addRow();
        if(this.hasNext()){
            this.selectRow(this.last+1, keepExisting);
            this.grid.getView().focusRow(this.last);
            return true;
        }
        return false;
    },
    selfJS : null,
    addRow : function(){
    	
    }
});
Ext.override(Ext.form.DisplayField,{
	hiddenValue : '',
	getRawValue : function(){
		if(!Ext.isEmpty(this.hiddenValue))
			return this.hiddenValue;
        var v = this.rendered ? this.el.dom.innerHTML : Ext.value(this.value, '');
        if(v === this.emptyText){
            v = '';
        }
        if(this.htmlEncode){
            v = Ext.util.Format.htmlDecode(v);
        }
        return v;
    },
	setRawValue : function(v){
        if(this.htmlEncode){
            v = Ext.util.Format.htmlEncode(v);
        }
        this.hiddenValue = v;
        return this.rendered ? (this.el.dom.innerHTML = (Ext.isEmpty(v) ? '' : v)) : (this.value = v);
    },
	setDValue : function(v){
		return this.el.dom.innerHTML = (Ext.isEmpty(v) ? '' : v);
	}
});
Ext.override(Ext.form.ComboBox,{
	autoScroll : false,
	//设置显示的值
	setLastSelectionText : function(val){
		this.lastSelectionText = val;
		this.el.dom.value= val;
	}
});
Ext.override(Ext.form.TextArea,{
	//设置显示的值
	styleHeight : '60px',
	onRender : function(ct, position){
        if(!this.el){
            this.defaultAutoCreate = {
                tag: "textarea",
                style:"width:100px;height:"+this.styleHeight+";",
                autocomplete: "off"
            };
        }
        Ext.form.TextArea.superclass.onRender.call(this, ct, position);
        if(this.grow){
            this.textSizeEl = Ext.DomHelper.append(document.body, {
                tag: "pre", cls: "x-form-grow-sizer"
            });
            if(this.preventScrollbars){
                this.el.setStyle("overflow", "hidden");
            }
            this.el.setHeight(this.growMin);
        }
    }
});
Ext.ToolTip.prototype.onTargetOver = Ext.ToolTip.prototype.onTargetOver.createInterceptor(function(e) {
	this.baseTarget = e.getTarget();
});
Ext.ToolTip.prototype.onMouseMove = Ext.ToolTip.prototype.onMouseMove.createInterceptor(function(e) {
	if (!e.within(this.baseTarget)) {
		this.onTargetOver(e);
		return false;
	}
});
Ext.override(Ext.grid.GridView,{
	isShowAll : false,
	initTemplates : function(){
        var ts = this.templates || {};
        if(!ts.master){
            ts.master = new Ext.Template(
                '<div class="x-grid3" hidefocus="true">',
                    '<div class="x-grid3-viewport">',
                        '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{ostyle}">{header}</div></div><div class="x-clear"></div></div>',
                        '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{bstyle}">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
                    '</div>',
                    '<div class="x-grid3-resize-marker">&#160;</div>',
                    '<div class="x-grid3-resize-proxy">&#160;</div>',
                '</div>'
            );
        }

        if(!ts.header){
            ts.header = new Ext.Template(
                '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                '<thead><tr class="x-grid3-hd-row">{cells}</tr></thead>',
                '</table>'
            );
        }

        if(!ts.hcell){
            ts.hcell = new Ext.Template(
                '<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="{style}"><div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '',
                '{value}<img class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />',
                '</div></td>'
            );
        }

        if(!ts.body){
            ts.body = new Ext.Template('{rows}');
        }

        if(!ts.row){
            ts.row = new Ext.Template(
                '<div class="x-grid3-row {alt}" style="{tstyle}"><table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                '<tbody><tr>{cells}</tr>',
                (this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
                '</tbody></table></div>'
            );
        }

        if(!ts.cell){
            var cls = "x-grid3-cell-inner";
			if(this.isShowAll)
				cls = "x-grid3-cell-inner1";
			ts.cell = new Ext.Template(
	        	'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
	        	'<div class="'+cls+' x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
	        	'</td>'
	        );
        }

        for(var k in ts){
            var t = ts[k];
            if(t && Ext.isFunction(t.compile) && !t.compiled){
                t.disableFormats = true;
                t.compile();
            }
        }

        this.templates = ts;
        this.colRe = new RegExp('x-grid3-td-([^\\s]+)', '');
    }
});

Ext.override(Ext.grid.EditorGridPanel,{
	startEditing : function(row, col){
        this.stopEditing();
        if(this.colModel.isCellEditable(col, row)){
            this.view.ensureVisible(row, col, true);
            var r = this.store.getAt(row);
            if(!r){
            	this.getSelectionModel().selectFirstRow(); 
            	return;
            }
            var field = this.colModel.getDataIndex(col),
                e = {
                    grid: this,
                    record: r,
                    field: field,
                    value: r.data[field],
                    row: row,
                    column: col,
                    cancel:false
                };
            if(this.fireEvent("beforeedit", e) !== false && !e.cancel){
                this.editing = true;
                var ed = this.colModel.getCellEditor(col, row);
                if(!ed){
                    return;
                }
                if(ed.field.getXType()=="textarea"){
                	ed.field.setHeight(this.view.getCell(row,col).clientHeight);
                }
                if(!ed.rendered){
                    ed.parentEl = this.view.getEditorParent(ed);
                    ed.on({
                        scope: this,
                        render: {
                            fn: function(c){
                                c.field.focus(false, true);
                            },
                            single: true,
                            scope: this
                        },
                        specialkey: function(field, e){
                            this.getSelectionModel().onEditorKey(field, e);
                        },
                        complete: this.onEditComplete,
                        canceledit: this.stopEditing.createDelegate(this, [true])
                    });
                }
                Ext.apply(ed, {
                    row     : row,
                    col     : col,
                    record  : r
                });
                this.lastEdit = {
                    row: row,
                    col: col
                };
                this.activeEditor = ed;
                ed.selectSameEditor = (this.activeEditor == this.lastActiveEditor);
                var v = this.preEditValue(r, field);
                ed.startEdit(this.view.getCell(row, col).firstChild, Ext.isDefined(v) ? v : '');
                if(ed.field.lastSelectionText){
            		ed.field.setLastSelectionText(this.view.getCell(row, col).firstChild.innerText);
            	}
                (function(){
                    delete ed.selectSameEditor;
                }).defer(50);
            }
        }
    }
});
Ext.override(Ext.grid.RowSelectionModel,{
	onEditorKey : function(field, e){
        var k = e.getKey(), 
            newCell, 
            g = this.grid, 
            last = g.lastEdit,
            ed = g.activeEditor,
            ae, last, r, c;
        var shift = e.shiftKey;
        if(k == e.TAB){
            e.stopEvent();
            ed.completeEdit();
            if(shift){
                newCell = g.walkCells(ed.row, ed.col-1, -1, this.acceptsNav, this);
            }else{
                newCell = g.walkCells(ed.row, ed.col+1, 1, this.acceptsNav, this);
            }
            if(newCell){
            	r = newCell[0];
	            c = newCell[1];
	            g.startEditing(r, c);
            }
        }
    }
});
Ext.override(Ext.Button,{
	getMenuClass : function(){
        return '';
    }
});
//grid 列数据可复制、粘贴
Ext.override(Ext.grid.Column,{
	renderer:function(value){
		return '<span>'+value+'</span>';
	}
});
