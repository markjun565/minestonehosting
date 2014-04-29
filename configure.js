$('#online-mode').change(function() {
    chProp('online-mode');
});
$('#gamemode').change(function() {
    chProp('gamemode');
});
$('#difficulty').change(function() {
    chProp('difficulty');
});
$('#pvp').change(function() {
    chProp('pvp');
});
$('#max-players').change(function() {
    chProp('max-players');
});
$('#enable-command-block').change(function() {
    chProp('enable-command-block');
});
$('#allow-flight').change(function() {
    chProp('allow-flight');
});
$('#white-list').change(function() {
    chProp('white-list');
});
$('#motd').change(function() {
    val = $('#motd').val();
    prop = 'motd';
    $.post('/ajax.php?ajx=motd', {
        motd: val
    });
    noty({
        text: '<strong>server.properties</strong><br />Property "' + prop + '" was set to "' + val + '"!',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
});

function chProp(prop) {
    val = $('#' + prop).val();
    $.get('/ajax.php?ajx=' + prop + '&v=' + val);
    noty({
        text: '<strong>server.properties</strong><br />Property "' + prop + '" was set to "' + val + '"!',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
}

$('.wlistrm').click(function() {
    val = $(this).next().html();
    rmlist('whitelist', val);
});

$('#cmd-button').click(function() {
    val = $('#cmd-send').val();
    $.post('/ajax.php?ajx=command', {
        cmd: val
    });
    $('#cmd-send').val('');
});

$('#cmd-send').keyup(function(e) {
    if (e.keyCode == 13) {
        val = $('#cmd-send').val();
        $.post('/ajax.php?ajx=command', {
            cmd: val,
            u: 'thisfane'
        });
        $('#cmd-send').val('');
    }
});

$('.olistrm').click(function() {
    val = $(this).next().html();
    rmlist('op', val);
});

function rmlist(type, name) {
    dolist(type, 'rem', name);
    noty({
        text: '<strong>' + type + '</strong><br />"' + htmlentities(name) + '" was removed.',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
    refreshlist(type);
}

function backup() {
    $.get('/ajax.php?ajx=backuptime', function(data) {
        $('#backup-time').html(data);
        $('#backup').modal();
    });
}

function performbackup() {
    $('#backup').modal('hide');
    noty({
        text: '<strong>Backup</strong><br />Backup is loading!',
        layout: 'bottomRight',
        type: 'information',
        timeout: 3000
    });
    $.get('/ajax.php?ajx=backbackup', function(data) {
        noty({
            text: '<strong>Backup</strong><br />The backup was copied to your server successfully!',
            layout: 'bottomRight',
            type: 'success',
            timeout: 3000
        });
    });
}

function addlist(type, name) {
    dolist(type, 'add', name);
    noty({
        text: '<strong>' + type + '</strong><br />"' + htmlentities(name) + '" was added.',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
}

function dolist(type, action, name) {
    $.get('/ajax.php?ajx=dolist&t=' + type + '&a=' + action + '&u=' + name, function(data) {
        refreshlist(type);
    });
}

function refreshlist(type) {
    $.get('/ajax.php?ajx=' + type + 'list', function(data) {
        $('#' + type).html(data);
    });
}

$('#wlistbut').click(function() {
    val = $('#wlistadd').val();
    addlist('whitelist', val);
    $('#wlistadd').val('');
});

$('#olistbut').click(function() {
    val = $('#olistadd').val();
    addlist('op', val);
    $('#olistadd').val('');
});

$('#wlistadd').keyup(function(e) {
    if (e.keyCode == 13) {
        val = $(this).val();
        addlist('whitelist', val);
        $(this).val('');
    }
});

$('#olistadd').keyup(function(e) {
    if (e.keyCode == 13) {
        val = $(this).val();
        addlist('op', val);
        $(this).val('');
    }
});

$('#status-loader').click(function() {
    updateStatus();
});

function updateStatus() {
    $('#status-loader').addClass('icon-spin stat-act');
    $.get('/ajax.php?ajx=status', function(data) {
        data = $.trim(data);
        $('#status').html(data);
    });
    setTimeout("$('#status-loader').removeClass('icon-spin stat-act')", 500);
}

function reinstall() {
    $.get('/ajax.php?ajx=reinstall');
    $('#reinstall').modal('hide');
    ga('send', 'event', 'server', 'reinstall');
    noty({
        text: '<strong>Server</strong><br />Your Server is deleted and will be created again!',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
    noty({
        text: '<strong>Server</strong><br />Page will reload in 10 seconds!',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
    setTimeout("noty({text:'<strong>Server</strong><br />Page will reload in 5 seconds!',layout:'bottomRight',type:'success',timeout:3000});", 5000);
    setTimeout("noty({text:'<strong>Server</strong><br />Page will reload now!',layout:'bottomRight',type:'success',timeout:3000});", 10000);
    setTimeout('window.location.reload();', 10100);
}


function start() {
    noty({
        text: '<strong>Server</strong><br />An attempt is being made to start your server!',
        layout: 'bottomRight',
        type: 'warning',
        timeout: 3000
    });
    setTimeout("updateStatus()", 100);
    setTimeout("updateStatus()", 3000);
    $.get('/ajax.php?ajx=startserver', function(data) {
        data = $.trim(data);
        gstate = "failed";
        if (data == "true") {
            noty({
                text: '<strong>Server</strong><br />Server was started!',
                layout: 'bottomRight',
                type: 'success',
                timeout: 3000
            });
            gstate = "started";
        } else if (data == "run") {
            noty({
                text: '<strong>Server</strong><br />Server cannot start! <br />Too many servers are running! <br /> Please try again.',
                layout: 'bottomRight',
                type: 'error',
                timeout: 10000
            });
        } else if (data == "warns") {
            noty({
                text: '<strong>Server</strong><br />Server cannot start! <br />You have too many warn points!',
                layout: 'bottomRight',
                type: 'error',
                timeout: 3000
            });
        } else if (data == "already") {
            noty({
                text: '<strong>Server</strong><br />Server already started!',
                layout: 'bottomRight',
                type: 'error',
                timeout: 3000
            });
        } else if (data == "plugins") {
            noty({
                text: '<strong>Server</strong><br />You have too many Plugins installed. You may only install 15 plugins.',
                layout: 'bottomRight',
                type: 'error',
                timeout: 3000
            });
        } else if (data == "connection") {
            noty({
                text: '<strong>Server</strong><br />Connection failed! Please try again!',
                layout: 'bottomRight',
                type: 'error',
                timeout: 3000
            });
        } else if (data == "wrongversion") {
            noty({
                text: '<strong>Server</strong><br />The chosen version doesn\'t exist! Please install another version and try to start again!',
                layout: 'bottomRight',
                type: 'error',
                timeout: 3000
            });
        } else {
            noty({
                text: '<strong>Server</strong><br />' + data,
                layout: 'bottomRight',
                type: 'error',
                timeout: 3000
            });
        }
        updateStatus();
        ga('send', 'event', 'server', 'start', gstate);
    });
}

function download(url) {
    var hiddenIFrameID = 'dlframe',
        iframe = document.getElementById(hiddenIFrameID);
    iframe.src = url;
}

function cdl() {
    $.get('/ajax.php?ajx=cdl', function(data) {
        download('https://aternos.org/download/' + $.trim(data) + '.zip');
        ga('send', 'event', 'server', 'download');
    });
}

function stop() {
    noty({
        text: '<strong>Server</strong><br />Server is shutting down!<br /><em>This may take up to 30sec. Please be patient!</em>',
        layout: 'bottomRight',
        type: 'success',
        timeout: 5000
    });
    setTimeout("updateStatus()", 100);
    $.get('/ajax.php?ajx=stopserver', function(data) {
        data = $.trim(data);
        if (data == 'true') {
            noty({
                text: '<strong>Server</strong><br />Server was stopped!',
                layout: 'bottomRight',
                type: 'success',
                timeout: 5000
            });
            ga('send', 'event', 'server', 'stop');
            updateStatus();
        } else if (data == 'already') {
            noty({
                text: '<strong>Server</strong><br />',
                layout: 'bottomRight',
                type: 'success',
                timeout: 5000
            });
            updateStatus();
        }
    });

}

function restart() {
    setTimeout("updateStatus()", 100);
    $.get('/ajax.php?ajx=restartserver');
    ga('send', 'event', 'server', 'restart');
    updateStatus();
    noty({
        text: '<strong>Server</strong><br />Server is restarting!',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
}

function installversion(type) {
    $('#' + type + '-install').attr('disabled', 'disabled');
    console.log("$('#" + type + "-install').attr('disabled','disabled');");
    noty({
        text: '<strong>Server</strong><br />Server will stop if running!',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
    val = $('#version-form-' + type).val();
    $.get('/ajax.php?ajx=installversion&v=' + val + '&t=' + type, function(data) {
        ga('send', 'event', 'server', 'install', type + " (" + val + ")");
        res = data.split(" ");
        if (res[1] == 0 && res[2] == 0) {
            noty({
                text: '<strong>Server</strong><br />Minecraft ' + val + ' installed!',
                layout: 'bottomRight',
                type: 'success',
                timeout: 3000
            });
        } else {
            noty({
                text: '<strong>Server</strong><br />Minecraft ' + val + ' installed!',
                layout: 'bottomRight',
                type: 'success',
                timeout: 3000
            });
            noty({
                text: '<strong>Server</strong><br />Server was started again!',
                layout: 'bottomRight',
                type: 'success',
                timeout: 3000
            });
        }
    });
    $('#' + type + '-install').removeAttr("disabled");
    updateStatus();
}

function htmlentities(txt) {
    dummie = document.createElement('code');
    dummie.appendChild(document.createTextNode(txt))
    return (dummie.innerHTML);
}

interval = setInterval('updateStatus()', 10000);


$('#snapshot-edit').click(function() {
    $('#snapshot').removeAttr('disabled');
    $('#snapshot').focus();
});
$('#snapshot').focusout(function() {
    $('#snapshot').attr('disabled', 'disabled');
});

function installsnapshot() {
    noty({
        text: '<strong>Server</strong><br />Server will stop if running!',
        layout: 'bottomRight',
        type: 'success',
        timeout: 3000
    });
    val = $('#snapshot').val();
    $.get('/ajax.php?ajx=installsnapshot&snap=' + val, function(data) {
        data = $.trim(data);
        res = data.split(" ");
        if (res[1] == 0 && res[2] == 0) {
            noty({
                text: '<strong>Server</strong><br />Minecraft Snapshot ' + val + ' installed!',
                layout: 'bottomRight',
                type: 'success',
                timeout: 3000
            });
        } else {
            noty({
                text: '<strong>Server</strong><br />Minecraft Snapshot ' + val + ' installed!',
                layout: 'bottomRight',
                type: 'success',
                timeout: 3000
            });
            noty({
                text: '<strong>Server</strong><br />Server was started again!',
                layout: 'bottomRight',
                type: 'success',
                timeout: 3000
            });
        }
    })
}




$('#console').click(function() {
    var winURL = '/console.php';
    var winName = 'console';
    var winSize = 'width=700,height=600,scrollbars=no';
    var ref = window.open(winURL, winName, winSize);
});
