<?php
namespace Tapsys\Checkout\Api;

interface EndpointInterface
{
  /**
   *      
   * Returns greeting message to user
   *
   * @api
   * @param string $url
   * @param string $firstName
   * @param string $lastName
   * @param string $billingEmail
   * @param string $environment
   * @param string $clientId
   * @param string $clientWordPressKey
   * @param string $merchantId
   * @param string $billingAddress
   * @param string $billingPhone
   * @param string $amount
   * @param string $currency
   * @return string Greeting message with users data.
   */
  public function data(
    $url,
    $firstName,
    $lastName,
    $billingEmail,
    $environment,
    $clientId,
    $clientWordPressKey,
    $merchantId,
    $billingAddress,
    $billingPhone,
    $amount,
    $currency
  );
}
