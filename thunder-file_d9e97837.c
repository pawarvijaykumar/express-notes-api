var client = new HttpClient();
var request = new HttpRequestMessage();
request.RequestUri = new Uri("https://www.thunderclient.com/welcome");
request.Method = HttpMethod.Get;

request.Headers.Add("Accept", "*/*");
request.Headers.Add("User-Agent", "Thunder Client (https://www.thunderclient.com)");

var response = await client.SendAsync(request);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);