var APIKEY_NYT = "2d3a2fc33866bb70cf76e05bf5465662:3:70162949";

function makeArticleEntry(articledata){
    title_link = '<a href="'+articledata.web_url+'">' + articledata.headline.main + '</a>';
    snippet = '<p>' + articledata.snippet + '</p>';
    htmlstring = title_link + snippet;
    return "<li class='article'>" + htmlstring + "</li>";
    //$nytElem.append(htmlstring);
}

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    var $picturecontainer = $("#picturecontainer");
    
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var $street = $("#street").val();
    var $city = $("#city").val();
    
    var streetAddress=  $street + "," + $city;
    
    var streetviewAPI = "https://maps.googleapis.com/maps/api/streetview?";
    var streetviewParams = "location="+streetAddress;
    var streetviewReq = streetviewAPI + streetviewParams + "&size=400x300";

    //$picturecontainer.append('<img src="'+streetviewReq+'" alt="streetview picture"></img>');
    $picturecontainer.html('<img src="'+streetviewReq+'" alt="streetview picture"></img><hr>');
    
    var nytBase = "http://api.nytimes.com/svc/search/v2/articlesearch";
    var nytReq = nytBase + ".json?q="+streetAddress+"&api-key="+APIKEY_NYT;
        
    
    var nytresponse = [];
    $.getJSON(nytReq, function(callbackData){
        //console.log(callbackData.response);
        nytresponse = callbackData.response.docs;
        console.log(nytresponse);
        for(var i = 0; i < callbackData.response.docs.length; i++){
            $nytElem.append(makeArticleEntry(callbackData.response.docs[i]));
        }
        
        if(nytresponse.length == 0){
            console.log(nytresponse.length);
            console.log(nytresponse);
        }
        
    }).error(function(){
        $nytElem.html("<h4>Articles could not be fetched</h2>");
    });
    
    
    
    /*
    if(nytresponse.length == 0){
        console.log("no articles found");
        nytReq = nytBase + ".json?q="+$city+"&api-key="+APIKEY_NYT;
        
        $.getJSON(nytReq, function(callbackData){
            console.log(callbackData.response);
            nytresponse = callbackData.response.docs;
            for(var i = 0; i < callbackData.response.docs.length; i++){
                $nytElem.append(makeArticleEntry(callbackData.response.docs[i]));
            }           
        });
    }
    */


    var wikiparams = {
        "format" : "json",
        "action" : "query",
        "generator" : "search",
        "gsrsearch" : $city
        //"format" : "json"
        //"search" : $city.val()
    };
    var dispWikiUrl = "http://en.wikipedia.org/wiki/";

    $.ajax({
        url: "http://en.wikipedia.org/w/api.php",
        dataType: "jsonp",
        data: wikiparams,
        success: function (response){
            $.each(response.query.pages, function(key, value)
            {
                var pageurl = value.title.replace(/ /g,'_');
                var disptitle = value.title;
                var newElemHtml = "<li><a href='"+dispWikiUrl+pageurl+"'>"+disptitle+"</a></li>";
                $wikiElem.append(newElemHtml);
            });        
        }
    });
    
    return false;
};

$('#form-container').submit(loadData);

// loadData();
