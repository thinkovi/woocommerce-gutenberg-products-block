/**
 * External dependencies
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { previewCart } from '@woocommerce/resource-previews';
import { dispatch } from '@wordpress/data';
import { CART_STORE_KEY as storeKey } from '@woocommerce/block-data';
import { SlotFillProvider } from '@woocommerce/blocks-checkout';
import { default as fetchMock } from 'jest-fetch-mock';

/**
 * Internal dependencies
 */
import Block from '../block';
import { defaultCartState } from '../../../../data/default-states';

const MiniCartBlock = ( props ) => (
	<SlotFillProvider>
		<Block { ...props } />
	</SlotFillProvider>
);
describe( 'Testing cart', () => {
	beforeEach( async () => {
		fetchMock.mockResponse( ( req ) => {
			if ( req.url.match( /wc\/store\/cart/ ) ) {
				return Promise.resolve( JSON.stringify( previewCart ) );
			}
			return Promise.resolve( '' );
		} );
		// need to clear the store resolution state between tests.
		await dispatch( storeKey ).invalidateResolutionForStore();
		await dispatch( storeKey ).receiveCart( defaultCartState.cartData );
	} );

	afterEach( () => {
		fetchMock.resetMocks();
	} );

	it( 'opens Mini Cart drawer when clicking on button', async () => {
		render( <MiniCartBlock /> );
		await waitFor( () => expect( fetchMock ).toHaveBeenCalled() );
		fireEvent.click( screen.getByText( /items/i ) );

		expect( screen.getByText( /Your cart/i ) ).toBeInTheDocument();
		expect( fetchMock ).toHaveBeenCalledTimes( 1 );
		// ["`select` control in `@wordpress/data-controls` is deprecated. Please use built-in `resolveSelect` control in `@wordpress/data` instead."]
		expect( console ).toHaveWarned();
	} );

	it( 'renders empty cart if there are no items in the cart', async () => {
		fetchMock.mockResponse( ( req ) => {
			if ( req.url.match( /wc\/store\/cart/ ) ) {
				return Promise.resolve(
					JSON.stringify( defaultCartState.cartData )
				);
			}
			return Promise.resolve( '' );
		} );
		render( <MiniCartBlock /> );

		await waitFor( () => expect( fetchMock ).toHaveBeenCalled() );
		fireEvent.click( screen.getByText( /items/i ) );

		expect( screen.getByText( /Cart is empty/i ) ).toBeInTheDocument();
		expect( fetchMock ).toHaveBeenCalledTimes( 1 );
	} );
} );
