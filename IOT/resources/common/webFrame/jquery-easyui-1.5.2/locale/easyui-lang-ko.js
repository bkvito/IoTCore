$.fn.pagination&&($.fn.pagination.defaults.beforePageText="\ud398\uc774\uc9c0",$.fn.pagination.defaults.afterPageText="{pages} \uc911",$.fn.pagination.defaults.displayMsg="\uc804\uccb4 {total} \ud56d\ubaa9 \uc911 {from}\ubd80\ud130 {to}\ubc88\uc9f8");$.fn.datagrid&&($.fn.datagrid.defaults.loadMsg="\ucc98\ub9ac \uc911\uc785\ub2c8\ub2e4. \uc7a0\uc2dc\ub9cc \uae30\ub2e4\ub824 \uc8fc\uc138\uc694...");$.fn.treegrid&&$.fn.datagrid&&($.fn.treegrid.defaults.loadMsg=$.fn.datagrid.defaults.loadMsg);$.messager&&($.messager.defaults.ok="\ud655\uc778",$.messager.defaults.cancel="\ucde8\uc18c");$.map("validatebox textbox passwordbox filebox searchbox combo combobox combogrid combotree datebox datetimebox numberbox spinner numberspinner timespinner datetimespinner".split(" "),function(a){$.fn[a]&&($.fn[a].defaults.missingMessage="\ud544\uc218 \ud56d\ubaa9\uc785\ub2c8\ub2e4.")});$.fn.validatebox&&($.fn.validatebox.defaults.rules.email.message="\uc62c\ubc14\ub978 \uba54\uc77c \uc8fc\uc18c\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694.",$.fn.validatebox.defaults.rules.url.message="\uc62c\ubc14\ub978 URL\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694.",$.fn.validatebox.defaults.rules.length.message="{0}\uc5d0\uc11c {1} \uc0ac\uc774\uc758 \uac12\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694.",$.fn.validatebox.defaults.rules.remote.message="\uc774 \ud544\ub4dc\ub97c \uc218\uc815\ud574 \uc8fc\uc138\uc694.");$.fn.calendar&&($.fn.calendar.defaults.weeks="\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""),$.fn.calendar.defaults.months="1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "));$.fn.datebox&&($.fn.datebox.defaults.currentText="\uc624\ub298",$.fn.datebox.defaults.closeText="\ub2eb\uae30",$.fn.datebox.defaults.okText="\ud655\uc778");$.fn.datetimebox&&$.fn.datebox&&$.extend($.fn.datetimebox.defaults,{currentText:$.fn.datebox.defaults.currentText,closeText:$.fn.datebox.defaults.closeText,okText:$.fn.datebox.defaults.okText});