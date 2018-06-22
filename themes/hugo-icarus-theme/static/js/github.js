var github_login_url = "https://github.com/login/oauth/authorize?client_id=49cf44111ca30026ae82&scope=user%20public_repo";
var gatekeeper_url = "https://gatekeeper-eoyljbktgv.now.sh";
var user_name = "kryptokrauts";
var repository_name = "kk-web-dev";

var github_oauth_token = undefined;
var ghObject = undefined;
var userObject = undefined;
var repositoryObject = undefined;
var issueObject = undefined;

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

$.deleteCookie = function() {
    Cookies.remove('github_oauth_token');
}

$.initGithubAuthentication = function() {
    github_oauth_token = Cookies.get('github_oauth_token');
    // check whether token was already safed as cookie
    if (github_oauth_token === undefined) {
        // check whether token is in url and if yes -> validate and safe as cookie
        var code = $.urlParam('code');
        if ( code !== null ) {
            $.ajax({
                url: gatekeeper_url + "/authenticate/" + code, 
                dataType: 'json', 
                async: false,
                success: function(json){
                    console.log(json);
                    github_oauth_token = json.token;
                }
            });
            console.log(github_oauth_token);
            Cookies.set('github_oauth_token', github_oauth_token);
        }
    }
    // init github-tools
    if ( github_oauth_token === undefined ) {
        ghObject = new GitHub(null, null);
        $( ".login-status" ).append( "<a href='" + github_login_url + "&redirect_uri=" + window.location.href + "'>Login</a>");
    } else {
        console.log(github_oauth_token);
        ghObject  = new GitHub({
            token: github_oauth_token
        });
        userObject = ghObject.getUser();
        userObject.getProfile(function(err, res) {
            $( ".login-status" ).append( "<p>" + res.login + "<br /><a href='.' onClick='$.deleteCookie()' >Logout</a></p>" );
        });
    }
    repositoryObject = ghObject.getRepo(user_name,repository_name);
    issueObject = ghObject.getIssues(user_name,repository_name);
}

$.getIssue = function() {
    return $("#metadata_issue").val();
}

$.addComment = function(issue, comment) {
    issueObject.createIssueComment(issue, comment, function(err, res) {
        console.log(res);
        $.renderGithubCommentSection(issue);
    })
}

$.renderGithubCommentSection = function(issue) {
    $("#github_comments").empty();
    issueObject.listIssueComments(issue, function(err, res) {
        for (var i=0; i<res.length; i++){
            $("#github_comments").append("<div class='comment'>"
                + "<b>Author:</b> " + res[i].user.login + "<br/>"
                + "<b>Body:</b> " + res[i].body
            + "</div>");
        };
        if ( userObject === undefined ) {
            $( "#github_comments" ).append( "<a href='" + github_login_url + "&redirect_uri=" + window.location.href + "'>Login</a> to make comments");
        } else {
            $("#github_comments").append("<form id='formNewComment' action='/'><textarea id='textareaComment' rows='4' cols='50'></textarea><input type='submit'></form>");
            $("#formNewComment").submit(function(event) {
                event.preventDefault();
                var comment = $("#textareaComment").val();
                console.log(comment);
                if (comment) {
                    $.addComment(issue, comment);
                } else {
                    alert("please enter a comment");
                }
            });
        }
    })
}

$(function() {
    $(document).ready(function() {
        $.initGithubAuthentication();
        var issue = $.getIssue();
        if (issue !== undefined) {
            $.renderGithubCommentSection(issue);
        }
    });
});