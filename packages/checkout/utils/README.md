# Checkout - Utilities <!-- omit in toc -->

Miscellaneous utility functions for dealing with checkout functionality.

## Table of Contents <!-- omit in toc -->

- [`extensionCartUpdate`](#extensioncartupdate)
  - [Usage](#usage)
  - [Options](#options)
    - [`args (object, required)`](#args-object-required)
- [`mustContain`](#mustcontain)
  - [Usage](#usage-1)
  - [Options](#options-1)
    - [`value (string, required)`](#value-string-required)
    - [`requiredValue (string, required)`](#requiredvalue-string-required)

## `extensionCartUpdate`

When executed, this will call the cart/extensions REST API endpoint. The new cart is then received into the client-side store.

### Usage

```typescript
// Aliased import
import { extensionCartUpdate } from '@woocommerce/blocks-checkout';

// Global import
// const { extensionCartUpdate } = wc.blocksCheckout;

extensionCartUpdate( {
	namespace: 'extension-unique-namespace',
	data: {
		key: 'value',
	},
} );
```

### Options

The following options are available:

#### `args (object, required)`

Args to pass to the Rest API endpoint. This can contain data and a namespace to trigger extension specific functionality on the server-side. [You can read more about this, and the server-side implementation, in this doc.](https://github.com/woocommerce/woocommerce-gutenberg-products-block/blob/trunk/docs/extensibility/extend-rest-api-update-cart.md)

## `mustContain`

Ensures that a given value contains a string, or throws an error.

### Usage

```js
// Aliased import
import { mustContain } from '@woocommerce/blocks-checkout';

// Global import
// const { mustContain } = wc.blocksCheckout;

mustContain( 'This is a string containing a <price />', '<price />' ); // This will not throw an error
mustContain( 'This is a string', '<price />' ); // This will throw an error
```

### Options

The following options are available:

#### `value (string, required)`

Value being checked. Must be a string.

#### `requiredValue (string, required)`

What value must contain. If this is not found within `value`, and error will be thrown.

<br/><br/><p align="center">
<a href="https://woocommerce.com/">
<img src="https://woocommerce.com/wp-content/themes/woo/images/logo-woocommerce@2x.png" alt="WooCommerce" height="28px" style="filter: grayscale(100%);
	opacity: 0.2;" />
</a><br/><a href="https://woocommerce.com/careers/">We're hiring</a>! Come work with us!</p>
