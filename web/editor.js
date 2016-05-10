var E = {
	path:null,
	msgNewFile:'File not found!',
	loadCompleted:false,
}

E.init = function() {
	$('.panel').css( "display", "none");
  E.onhashchange();
  if (window.location.protocol === 'https:') {
    $('#menuLogin').removeClass('hide');
    $('#menuEdit').removeClass('hide');
  }
}

E.isLogin = function() {
  if (localStorage.wd_login !== "true") { 
	  // 注意：sessionStorage 不能跨頁面持續，所以得用 localStorage
    alert('You can not save & edit before login. Please login now !');
    E.Server.login();
    return false;
  }
  return true;
}

E.Server = {
  timeout : 4000
};

E.Server.save=function(path, text) {
	if (!path.startsWith("/")) path="/"+path;
	console.log("save");
  $.ajax({
    type: "POST",
    url: "/file"+path,
    timeout: this.timeout,
    data: { text: text },
    statusCode: {
      401: function() { // 401:Unauthorized
        localStorage.wd_login = "false";
        E.isLogin();
      }
    }
  })
  .done(function(data) {
		console.log("save success");
    alert("Save success!");
  })
  .fail(function() {
    alert("Save fail!");
  });
}

E.Server.load=function(path) {
	if (!path.startsWith("/")) path="/"+path;
  return $.ajax({
    type: "GET",
    url: "/file"+path,
    timeout: this.timeout,
    data: {}
  });
}

E.Server.login=function() {
  $.ajax({
    type: "POST",
    url: "/login",
    timeout: this.timeout,
    data: { user:$('#loginUser').val(), password:$('#loginPassword').val() },
  })
  .done(function(data) {
    localStorage.wd_login = "true";
    alert( "Login success!");
    $('#loginPassword').val('');
    E.edit();
  })
  .fail(function() {
    localStorage.wd_login = "false";
    alert("Login fail!\nDefault : user=root , password=123\nModify or add (user, password) in setting.js for security");
    E.login();
  });
}

E.Server.logout=function() {
  $.ajax({
    type: "POST",
    url: "/logout",
    timeout: this.timeout,
    data: {},
  })
  .done(function(data) {
    localStorage.wd_login = "false";
    alert( "Logout success!");
		E.switchPanel('panelShow');
  })
  .fail(function() {
    alert( "Logout fail!" );
  });
}

E.switchPanel=function(name) {
  $('.panel').css( "display", "none");
  $('#'+name).css( "display", "block");
}

E.login=function() {
  E.switchPanel('panelLogin');
}

E.logout=function() {
  E.Server.logout();
}

E.edit=function () {
  E.switchPanel('panelEdit');
}

E.upload=function() {
  if (!E.isLogin()) return;
  E.switchPanel('panelUpload');
  $("#imageUpload").fileinput({
    uploadUrl: "/upload/"+E.path,
    maxFileCount: 10,
    uploadAsync: false,
    uploadExtraData: { path: E.path }
  });
}

E.httpRef=function() {
  return window.location.href.replace('https:', 'http:');
}

E.facebookShare=function() {
  window.open("https://www.facebook.com/sharer/sharer.php?u="+escape(E.httpRef())+'&t='+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
}

E.show=function() {
	var editText = $('#editBox').val();
	var content;
	try {
		content = JSON.parse(editText);
	} catch (e) {
		content = editText;
	}
	var html = E.render(content);
	// http://stackoverflow.com/questions/12449890/reload-content-in-modal-twitter-bootstrap
	$('#htmlBox').html(html);
	$("#htmlBox").animate({ scrollTop: 0 }, "fast");		
  E.switchPanel('panelShow');
}

E.render=function(content) {
	if (typeof content === 'string') {
		return "<pre>\n"+content+"</pre>\n";
	} else if (content.type==="directory"){
		var files = content.files;
		var html = "<UL>\n";
		var path = E.path;
		if (!path.endsWith("/")) path=path+"/";
		for (var i=0; i<files.length; i++) {
			var rewritePath = path;
			html += "<LI><a href='#"+rewritePath+files[i]+"\'>"+files[i]+"</a></LI>\n";
		}
		html += "</UL>\n";
		return html;
	}	
}

E.loadFile=function(path) {
  E.path = path;
  E.Server.load(path)
  .done(function(content) {
		if (typeof content === 'string')
			editText = content;
		else
			editText = JSON.stringify(content, null, ' ');
		$('#editBox').val(editText);
    E.show();
  })
  .fail(function() {
    $('#editBox').val(E.msgNewFile);
    E.show();
  });
}

E.onhashchange = window.onhashchange = function() {
  var filepath = window.location.hash.substring(1);
	E.loadFile(filepath);
}

E.save=function() {
  if (!E.isLogin()) return;
  var editText = $('#editBox').val();
  E.Server.save(E.path, editText);
}

