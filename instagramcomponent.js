function InstagramComponentJS(options) {
    indexs= 5;
    urlInstagram= "https://www.instagram.com/explore/tags/";
    strRepleace = '$tags';
    windowsHeigth = $(window).height();
    buildDesk = function(data,options) {
        if(data.data==undefined ) return false;
        var newDesc = makeUrlTags(options.description,data.data.tags,options.pageType)
        var countIndex = 1;
        var carouselId = $('#'+options.containerId);
        carouselId.find('.instagram-component__subtitle').html(newDesc)
        var container = carouselId.find('.index-'+countIndex);
        if(data.data.items&&data.data.items.length>0){
            containerMobile = carouselId.find('.insta-gallery-mobile');
            for (var i = 0; i < data.data.items.length; i++) {
                container = carouselId.find('.index-'+countIndex);

                var template = $(options.template);
                var item = data.data.items[i]
                template.find('a').attr('href',item.p_permalink)
                template.find('img').attr('src',item.p_url)
                template.find('.insta-gallery__text-user').html("@"+item.p_username)
                template.find('.insta-gallery-user').html("@"+item.p_username)
                // template.find('.likes').html(item.p_likes)
                // template.find('.comments').html(item.p_comments)
                containerMobile.append(template.clone())
                container.append(template.clone())
                countIndex++;
                if(countIndex>indexs){
                    countIndex=1;
                }
            }
            carouselId.removeClass('hide');
            carouselId.find('.insta-gallery__button').click(function(){
                var gallery = carouselId.find('.insta-gallery');
                if(gallery.hasClass('showAll')){
                    gallery.removeClass('showAll')
                    $(this).html('Ver todo');
                }else{
                    gallery.addClass('showAll')
                    $(this).html('Ver menos');
                }
            })
        }
    }
    this.build = function() {
        var dataForm = {};
        dataForm.tags = options.tags;
        dataForm.limit = options.limit;
        dataForm.order = options.order;
        if(options.pageType=='PRODUCT'){
            dataForm.product= $('#baseProductCode').val();
        }
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: options.url,
            data : dataForm,
            success: function(data){
                buildDesk(data,options);
            },
        });
    }
    makeUrlTags = function(description, tags){
        // tags = tags.split(',');
        var urls = [];
        for (var i = 0; i < tags.length; i++) {
            urls.push('<a target="_black" href="'+(urlInstagram+tags[i])+'">#'+tags[i]+'</a>')
        }
        urls = urls.join(',');
        description =description.replace(strRepleace,urls)
        return description;
    }
}