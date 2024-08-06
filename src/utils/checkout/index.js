import { isArray, isEmpty } from 'lodash';
import { createCheckoutSession } from 'next-stripe/client'; // @see https://github.com/ynnoj/next-stripe
import { loadStripe } from '@stripe/stripe-js';
import { createTheOrder, getCreateOrderData } from './order';
import { clearCart } from '../cart';
import axios from 'axios';
import { WOOCOMMERCE_STATES_ENDPOINT } from '../constants/endpoints';


export const handleOtherPaymentMethodCheckout = async (input, products, setRequestError, setCart, setIsOrderProcessing, setCreatedOrderData) => {
    setIsOrderProcessing(true);

    const orderData = getCreateOrderData(input, products);
    const customerOrderData = await createTheOrder(orderData, setRequestError, '');
    const cartCleared  = await clearCart(setCart, () => {
        
    });

    setIsOrderProcessing(false);

    if(isEmpty(customerOrderData?.orderId) || cartCleared?.error) {
        setRequestError('Clear cart failed');
        return null;
    }

    setCreatedOrderData(customerOrderData);

    return customerOrderData;
}

export const handleStripeCheckout = async (input, products, setRequestError, setCart, setIsProcessing, setCreatedOrderData) => {
    setIsProcessing(true);
    const orderData = getCreateOrderData(input, products);
    const customerOrderData = await createTheOrder(orderData, setRequestError, '');
    const cartCleared = await clearCart(setCart, () => {

    });
    setIsProcessing(false);

    if(isEmpty(customerOrderData?.orderId) || cartCleared?.error){
        setRequestError('Clear cart failed');
        return null;
    }

    setCreatedOrderData(customerOrderData);
    await createCheckoutSessionAndRedirect(products, input, customerOrderData?.orderId);
    
    return customerOrderData;
}

const createCheckoutSessionAndRedirect = async (products, input, orderId) => {
    const sessionData = {
        success_url: window.location.origin + `thank-you?session_id={CHECKOUT_SESSION_ID}&order_id=${ orderId }`,
        cancel_url: window.location.href,
        customer_email: input.billingDifferentThanShipping ? input?.billing?.email : input?.shipping?.email,
        line_items: getStripeLineItems(products),
        metadata: getMetaData(input, orderId),
        payment_method_types: ['card'],
        mode: 'payment',
    };

    console.log('sessionData', sessionData);

    let session = {};

    try {
        session = await createCheckoutSession(sessionData);
    } catch (err) {
        console.log('createCheckout session error', err)
    }

    try {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        if(stripe){
            stripe.redirectToCheckout({sessionId: session.id});
        }
    } catch (error) {
        console.log(error)
    }
}

const getStripeLineItems = (products) => {
    if(isEmpty(products) && !isArray(products)){
        return [];
    }

    return products.map(product => {
        return {
            quantity: product?.quantity ?? 0,
            name: product?.data?.name ?? '',
            images: [product?.data?.images?.[0]?.src ?? '' ?? ''],
            amount: Math.round((product?.line_subtotal ?? 0) * 100),
            curreny: 'usd', 
        }
    })
}

export const getMetaData = (input, orderId) => {
    return {
        billing: JSON.stringify(input?.billing),
        shipping: JSON.stringify(input.billingDifferentThanShipping ? input?.billing?.email : input?.shipping?.email),
        orderId
    }
}

export const handleBillingDifferentThanShipping = (input, setInput, target) => {
    const newState = {...input, [target.name]: !input.billingDifferentThanShipping};
    setInput(newState);
}


export const handleCreateAccount = (input, setInput, target) => {
    const newState = {...input, [target.name]: !input.createAccount};
    setInput(newState);
}

export const setStatesForCountry = async(target, setTheStates, setIsFetchingStates) => {
    if('country' === target.name){
        setIsFetchingStates(true);
        const countryCode = target[target.selectedIndex].getAttribute('data-countrycode');
        const states = await getStates(countryCode);
        setTheStates(states || []);
        setIsFetchingStates(false);
    }
}


export const getStates = async(countryCode = '') => {
    if(!countryCode){
        return [];
    }

    const {data} = await axios.get(WOOCOMMERCE_STATES_ENDPOINT, {params: {countryCode}});

    return data?.states ?? [];
}