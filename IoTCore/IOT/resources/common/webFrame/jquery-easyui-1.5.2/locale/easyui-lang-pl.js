$.fn.pagination&&($.fn.pagination.defaults.beforePageText="Strona",$.fn.pagination.defaults.afterPageText="z {pages}",$.fn.pagination.defaults.displayMsg="Wy\u015bwietlono elementy od {from} do {to} z {total}");$.fn.datagrid&&($.fn.datagrid.defaults.loadMsg="Przetwarzanie, prosz\u0119 czeka\u0107 ...");$.fn.treegrid&&$.fn.datagrid&&($.fn.treegrid.defaults.loadMsg=$.fn.datagrid.defaults.loadMsg);$.messager&&($.messager.defaults.ok="Ok",$.messager.defaults.cancel="Cancel");$.map("validatebox textbox passwordbox filebox searchbox combo combobox combogrid combotree datebox datetimebox numberbox spinner numberspinner timespinner datetimespinner".split(" "),function(a){$.fn[a]&&($.fn[a].defaults.missingMessage="To pole jest wymagane.")});$.fn.validatebox&&($.fn.validatebox.defaults.rules.email.message="Wprowad\u017a poprawny adres email.",$.fn.validatebox.defaults.rules.url.message="Wprowad\u017a poprawny adres URL.",$.fn.validatebox.defaults.rules.length.message="Wprowad\u017a warto\u015b\u0107 z zakresu od {0} do {1}.",$.fn.validatebox.defaults.rules.remote.message="Prosz\u0119 poprawi\u0107 to pole.");$.fn.calendar&&($.fn.calendar.defaults.weeks="NPW\u015aCPS".split(""),$.fn.calendar.defaults.months="Sty Lut Mar Kwi Maj Cze Lip Sie Wrz Pa\u017a Lis Gru".split(" "));$.fn.datebox&&($.fn.datebox.defaults.currentText="Dzisiaj",$.fn.datebox.defaults.closeText="Zamknij",$.fn.datebox.defaults.okText="Ok");$.fn.datetimebox&&$.fn.datebox&&$.extend($.fn.datetimebox.defaults,{currentText:$.fn.datebox.defaults.currentText,closeText:$.fn.datebox.defaults.closeText,okText:$.fn.datebox.defaults.okText});