## Work Log

* 8-24-2018 8:30pm - Clone repo
* 8-24-2018 8:31pm - Review node code
* 8-24-2018 8:35pm - Install and run server with --trace-sync-io to search for synchronous calls, api/usages route has no synchronous calls
* 8-24-2018 8:40pm - Investigate node benchmarking
* 8-24-2018 8:50pm - Install Apache Benchmark and evaluate base api performance
```
ab -p post.json -T application/json -c 100 -n 100000 http://localhost:3000/api/usages

Concurrency Level:      100
Time taken for tests:   36.045 seconds
Complete requests:      100000
Failed requests:        99991
   (Connect: 0, Receive: 0, Length: 99991, Exceptions: 0)
Total transferred:      21788796 bytes
Total body sent:        25200000
HTML transferred:       1188895 bytes
Requests per second:    2774.28 [#/sec] (mean)
Time per request:       36.045 [ms] (mean)
Time per request:       0.360 [ms] (mean, across all concurrent requests)
Transfer rate:          590.32 [Kbytes/sec] received
                        682.73 kb/s sent
                        1273.05 kb/s total
```
* 8-24-2018 8:52pm - Remove logging and re-evaluate
```
Concurrency Level:      100
Time taken for tests:   31.173 seconds
Complete requests:      100000
Failed requests:        26001
   (Connect: 0, Receive: 0, Length: 26001, Exceptions: 0)
Total transferred:      21826001 bytes
Total body sent:        25200000
HTML transferred:       1226001 bytes
Requests per second:    3207.86 [#/sec] (mean)
Time per request:       31.173 [ms] (mean)
Time per request:       0.312 [ms] (mean, across all concurrent requests)
Transfer rate:          683.74 [Kbytes/sec] received
                        789.43 kb/s sent
                        1473.17 kb/s total
```
* 8-24-2018 8:52pm - Apply NODE_ENV=production
```
Concurrency Level:      100
Time taken for tests:   29.546 seconds
Complete requests:      100000
Failed requests:        99991
   (Connect: 0, Receive: 0, Length: 99991, Exceptions: 0)
Total transferred:      21788796 bytes
Total body sent:        25200000
HTML transferred:       1188895 bytes
Requests per second:    3384.57 [#/sec] (mean)
Time per request:       29.546 [ms] (mean)
Time per request:       0.295 [ms] (mean, across all concurrent requests)
Transfer rate:          720.17 [Kbytes/sec] received
                        832.92 kb/s sent
                        1553.09 kb/s total
```
* 8-24-2018 8:52pm - Prepare project for horizontal scaling
  * Install redis, uuid
  * Generate a uuid, push the uuid and post doc to redis
  * Return uuid
  * Deploy docker instance
    * sudo docker build . -t busyapi
    * sudo docker run -p 3001:3000 -e "REDIS_URL=redis://129.196.196.100:6379" busyapi &
    

```
Concurrency Level:      100
Time taken for tests:   31.036 seconds
Complete requests:      100000
Failed requests:        0
Non-2xx responses:      100000
Total transferred:      39700000 bytes
Total body sent:        25200000
HTML transferred:       18200000 bytes
Requests per second:    3222.07 [#/sec] (mean)
Time per request:       31.036 [ms] (mean)
Time per request:       0.310 [ms] (mean, across all concurrent requests)
Transfer rate:          1249.18 [Kbytes/sec] received
                        792.93 kb/s sent
                        2042.11 kb/s total
```
* 8-24-2018 9:15pm - Research Docker and run api from a docker container
* 8-24-2018 10:30pm - Docker containers are unable to access external redis instance. 
This is a configuration issue that was unable to be resolved within the allotted time 
limit

## Architecture and Suggested Changes

In order to solve the api scaling problem I propose a micro-service solution based on docker instances of the api

This solution requires a datastore (such as redis), multiple instances of the api (via docker containers), and a load balancer (nginx) to
handle the 1 million user per minute problem. This solution provides horizontal scaling via the docker containers instances the number of
 which can be increased to meet the required demand. The bottleneck then becomes the datastore which can be clustered to accomodate the 
 load. This solution is independent of the specs for each machine, though enabling node clustering can provide increased performance on 
 severs with more cores. 
 
Another solution to the problem can be achieved using AWS Lambda for a serverless backend.

## Measuring API performance

For this example Apache Benchmark was chosen to test the api performance. The performance metrics logged for this example are misleading 
as the performance testing was done on the same machine that the api was running on. For more accurate results benchmarking software 
should be run from a different machine. 

Other examples of benchmarking tools include Artillery and Bombardier. 



