<?php
namespace Tapsys\Checkout\Api;

interface EndpointInterface
{
  /**
   *      
   * Returns greeting message to user
   *
   * @api
   * @param string $firstName
   * @param string $lastName
   * @param string $billingEmail
   * @param string $billingAddress
   * @param string $billingPhone
   * @param string $amount
   * @param string $currency
   * @return string Greeting message with users data.
   */
  public function data(
    $firstName,
    $lastName,
    $billingEmail,
    $billingAddress,
    $billingPhone,
    $amount,
    $currency
  );
}
