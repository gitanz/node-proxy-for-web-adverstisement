
var http = require("http");

var url = require("url");


http.createServer(onRequest).listen(1337);

var mysql = require("mysql");

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'web_alert'
});


function onRequest(req, res) {

    var reqUrl = "http://stackoverflow.by/questions/18498726/how-do-i-get-the-domain-originating-the-request-in-express-js";

    var hostnameParts = url.parse(reqUrl).hostname.split(".");

    var domain = hostnameParts[hostnameParts.length-1];



//== "/wnx.js?v=1"

    if(req.url){

        getAllSubscribers(domain, function(err, data){

            if(err) throw err;

            console.log(data);

            var html = "document.write(\'" +
                                        "<div style=\"position:fixed;top:0;left:0;right:0;bottom:0;z-index: 99998;background: rgba(238, 238, 238, 0.55); \"></div>" +
                                        "<div style=\"position:fixed;top:0;left:0;right:0;bottom:0;height: 220px;margin:auto;width: 350px;z-index: 999999;box-shadow: 0px 0px 15px #CCC;\">" +
                                            "<img src=\""+data[0].image+"\" style=\"height: 220px;width: 350px;\">" +
                                            "<span style=" +
                                                            "\"position: absolute;" +
                                                            "display: inline-block;" +
                                                            "right: -15px;top: -15px;" +
                                                            "background: #000;width: 20px;" +
                                                            "height: 20px;text-align: center;" +
                                                            "color: #FFF;" +
                                                            "border-radius: 20px;" +
                                                            "text-transform: lowercase;" +
                                                            "font-family: sans-serif;" +
                                                            "vertical-align: middle;" +
                                                            "line-height: 20px;" +
                                                            "font-size: 16px;" +
                                                            "cursor: pointer;\" " +
                                                            "onclick=\"centerElement = this.parentElement; overlay = centerElement.previousElementSibling; overlay.remove(); centerElement.remove()\">" +
                                                "X" +
                                            "</span>" +
                                            "</div>\')";

            res.end(html);

        });

    }else{

        res.end("");

    }


}

function getAllSubscribers(domain, callback){

    sql =   "SELECT image_url FROM `category_images`"+
            "INNER JOIN `categories` ON categories.`id` = category_images.`category_id`"+
            "WHERE categories.`host` = '"+domain+"' LIMIT 1";

    connection.query(sql, function(err, rows, fields){

        if(err){
            callback(err, null);
        }

        var result = [];

        console.log(rows);

        for(var i=0; i< rows.length; i++){

            result[i]= {"id":rows[i].id,"name":rows[i].name,"msisdn":rows[i].msisdn,"imei":rows[i].imei, "image":rows[i].image_url}

        }

        if(result.length > 0 ){

            callback(null, result);

        }else{

            result[0]= {"id":"","name":"","msisdn":"","imei":"", "image":"http://www.unifun.com/wdns_beeline_tj/wp-content/themes/wdns/includes/images/banner_beeline.png"}
            callback(null, result);

        }

    });

}
