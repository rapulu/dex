<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class TokenController extends Controller
{
    public function getTokenPrices(Request $request)
    {

        $addressOne = $request->query('addressone');
        $addressTwo = $request->query('addresstwo');

        $apiKey = env('MORALIS_KEY');

        $chain = 'eth'; // Example: use Ethereum mainnet

        $headers = [
            'Accept' => 'application/json',
            'X-API-Key' => $apiKey,
        ];

        $responses = Http::pool(fn(Pool $pool) => [
            $pool->as('addressOne')->withHeaders($headers)
            ->get("https://deep-index.moralis.io/api/v2.2/erc20/{$addressOne}/price", [
                'chain' => $chain,
            ]),

            $pool->as('addressTwo')->withHeaders($headers)
            ->get("https://deep-index.moralis.io/api/v2.2/erc20/{$addressTwo}/price", [
                'chain' => $chain,
            ]),
        ]);

        if ($responses['addressOne']->successful() && $responses['addressTwo']->successful()) {

            $tokenOne = $responses['addressOne']->json();
            $tokenTwo = $responses['addressTwo']->json();

            return response()->json([
                'message' => 'Token prices fetched successfully',
                'data' => [
                    'tokenOnePrice' => $tokenOne['usdPrice'] ?? null,
                    'tokenTwoPrice' => $tokenTwo['usdPrice'] ?? null,
                    'ratio' => ($tokenTwo['usdPrice'] ?? 1) != 0 ? ($tokenOne['usdPrice'] ?? 0) / ($tokenTwo['usdPrice'] ?? 1) : null,
                ],
            ], 200);
        } else {
            // Handle errors
            Log::error('Moralis API Error: ' . $responses['addressOne']->body());
            return null;
        }
    }
}
