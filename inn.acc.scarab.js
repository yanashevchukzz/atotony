ACC.scarab = {
	categories: [],
	categoryPath: null,
	facetCategories: null,
	getCategoryPath: function(facetCategories){
		ACC.scarab.facetCategories = facetCategories;
		ACC.scarab.categories.push('IS Root');
		ACC.scarab.pushCategory('type');
		ACC.scarab.pushCategory('gender');
		ACC.scarab.pushCategory('sport');
		ACC.scarab.pushCategory('brand');
		
		if(ACC.scarab.categories.length > 0){
			return ACC.scarab.categories.join(' > ');
		}
		
		return null;
	},
	pushCategory: function(categoryCode){
		var category = null;
		var categoryFilters = $('#product-facet .' + categoryCode + ' li');
		
		if(categoryFilters.length == 1){
			category = $(categoryFilters[0]).find('a').html();
		}
		if(ACC.scarab.facetCategories != null && typeof ACC.scarab.facetCategories[categoryCode] !== 'undefined') {
			category = ACC.scarab.facetCategories[categoryCode];
		}
		if(typeof category != 'undefined' && category != null){
			ACC.scarab.categories.push(category);
		}
	}
};