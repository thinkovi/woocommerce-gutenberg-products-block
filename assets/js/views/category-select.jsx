const { __ } = wp.i18n;
const { Toolbar, withAPIData, Dropdown, Dashicon } = wp.components;

/**
 * When the display mode is 'Product category' search for and select product categories to pull products from.
 */
export class ProductsCategorySelect extends React.Component {

	/**
	 * Constructor.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			selectedCategories: props.selected_display_setting,
			openAccordion: null,
			filterQuery: '',
		}

		this.checkboxChange  = this.checkboxChange.bind( this );
		this.accordionToggle = this.accordionToggle.bind( this );
		this.filterResults   = this.filterResults.bind( this );
	}

	/**
	 * Handle checkbox toggle.
	 *
	 * @param Event object evt
	 */
	checkboxChange( evt ) {
		let selectedCategories = this.state.selectedCategories;

		if ( evt.target.checked && ! selectedCategories.includes( parseInt( evt.target.value, 10 ) ) ) {
			selectedCategories.push( parseInt( evt.target.value, 10 ) );
		} else if ( ! evt.target.checked ) {
			selectedCategories = selectedCategories.filter( category => category !== parseInt( evt.target.value, 10 ) );
		}

		this.setState( {
			selectedCategories: selectedCategories
		} );

		this.props.update_display_setting_callback( selectedCategories );
	}

	accordionToggle( category ) {
		let value = category;

		if ( value === this.state.openAccordion ) {
			value = null;
		}

		this.setState( {
			openAccordion: value
		} );
	}

	/**
	 * Filter categories.
	 *
	 * @param Event object evt
	 */
	filterResults( evt ) {
		this.setState( {
			filterQuery: evt.target.value
		} );
	}

	/**
	 * Render the list of categories and the search input.
	 */
	render() {
		return (
			<div className="product-category-select">
				<ProductCategoryFilter filterResults={ this.filterResults } />
				<ProductCategoryList
					filterQuery={ this.state.filterQuery }
					selectedCategories={ this.state.selectedCategories }
					checkboxChange={ this.checkboxChange }
					accordionToggle={ this.accordionToggle }
					openAccordion={ this.state.openAccordion }
				/>
			</div>
		);
	}
}

/**
 * The category search input.
 */
const ProductCategoryFilter = ( { filterResults } ) => {
	return (
		<div>
			<input id="product-category-search" type="search" placeholder={ __( 'Search for categories' ) } onChange={ filterResults } />
		</div>
	);
}

/**
 * Fetch and build a tree of product categories.
 */
const ProductCategoryList = withAPIData( ( props ) => {
		return {
			categories: '/wc/v2/products/categories'
		};
	} )( ( { categories, filterQuery, selectedCategories, checkboxChange, accordionToggle, openAccordion } ) => {
		if ( ! categories.data ) {
			return __( 'Loading' );
		}

		if ( 0 === categories.data.length ) {
			return __( 'No categories found' );
		}

		const AccordionButton = ( { category } ) => {
			let icon = 'arrow-down-alt2';

			if ( openAccordion === category ) {
				icon = 'arrow-up-alt2';
			}

			return (
				<button onClick={ () => accordionToggle( category ) } type="button" className="product-category-accordion-toggle">
					<Dashicon icon={ icon } />
				</button>
			);
		};

		const CategoryTree = ( { categories, parent } ) => {
			let filteredCategories = categories.filter( ( category ) => category.parent === parent );

			return ( filteredCategories.length > 0 ) && (
				<ul>
					{ filteredCategories.map( ( category ) => (
						<li key={ category.id } className={ ( openAccordion === category.id ? 'product-category-accordion-open' : '' ) }>
							<label htmlFor={ 'product-category-' + category.id }>
								<input type="checkbox"
								       id={ 'product-category-' + category.id }
								       value={ category.id }
								       checked={ selectedCategories.includes( category.id ) }
								       onChange={ checkboxChange }
								/> { category.name }
								<span className="product-category-count">{ category.count }</span>
								{ 0 === category.parent &&
									<AccordionButton category={ category.id } />
								}
							</label>
							<CategoryTree categories={ categories } parent={ category.id } />
						</li>
					) ) }
				</ul>
			);
		};

		let categoriesData = categories.data;

		if ( '' !== filterQuery ) {
			categoriesData = categoriesData.filter( category => category.slug.includes( filterQuery.toLowerCase() ) );
		}

		return (
			<div className="product-categories-list">
				<CategoryTree categories={ categoriesData } parent={ 0 } />
			</div>
		);
	}
);
