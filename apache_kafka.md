Apache Kafka
============

> Apache Kafka is publish-subscribe messaging rethought as a distributed commit log.
> #### Fast
> A single Kafka broker can handle hundreds of megabytes of reads and writes per second from thousands of clients.
> #### Scalable
> Kafka is designed to allow a single cluster to serve as the central data backbone for a large organization. It can be elastically and transparently expanded without downtime. Data streams are partitioned and spread over a cluster of machines to allow data streams larger than the capability of any single machine and to allow clusters of co-ordinated consumers
> #### Durable
> Messages are persisted on disk and replicated within the cluster to prevent data loss. Each broker can handle terabytes of messages without performance impact.
> #### Distributed by Design
> Kafka has a modern cluster-centric design that offers strong durability and fault-tolerance guarantees.

Kafka's [homepage](http://kafka.apache.org/) is a good starting point for understanding Kafka. Links to pretty good documentation; the [design section](http://kafka.apache.org/documentation.html#design) in particular is very good, insightful.

***

Introductions
-------------

#### [Apache Kafka: Presentation](http://www.slideshare.net/charmalloc/apache-kafka)

A short presentation by Jeo Stein, Chief Architect at Medialets and a Kafka committer. Covers:

* What is it?
* Why do we need it?
* What do we get?
* How do we get it?
* Code and commandline samples

***

Evaluations and Camparisons
---------------------------


#### [Apache Kafka Evaluation](http://muse-amuse.in/~madhusudancs/asterixdb-kafkaeval/presentation.html)

Someone from AstrixDB(?) evaluating Kafka to see if it fits their needs; a presentation. Good presentation, introduces characterisitcs and capabilities, goes over usage (including code samples), quotes benchmarks, presents downsides and compares (shallow) with alternatives (Scribe, RabbitMQ, ActiveMQ).


#### [RabbitMQ vs Kafka: which one for durable messaging with good query features?](http://www.quora.com/RabbitMQ/RabbitMQ-vs-Kafka-which-one-for-durable-messaging-with-good-query-features)

A very good, detailed answer (by Stuart Charlton). Alexis Richardson, the CEO of Rabbit Technologies (which develops RabbitMQ, of course) commented on the answer. Jay Kreps, the architect of Kafka responded to Alexis and they have an enlightening conversation there.

Here are best bits (copied from <http://java.dzone.com/articles/vmwares-rabbitmq-vs-linkedins>):

> **Use Kafka** if you have a fire hose of events (100k+/sec) you need delivered in partitioned order 'at least once' with a mix of online and batch consumers, you want to be able to re-read messages, you can deal with current limitations around node-level HA (or can use trunk code), and/or you don't mind supporting incubator-level software yourself via forums/IRC.  
> <br/>
> **Use RabbitMQ** if you have messages (20k+/sec) that need to be routed in complex ways to consumers, you want per-message delivery guarantees, you don't care about ordered delivery, you need HA at the cluster-node level now, and/or you need 24x7 paid support in addition to forums/IRC.
> <br/><br/>
> **Both** have similar distributed deployment goals but they differ on message model semantics.  
> <br/>
> **Neither** offers great "filter/query" capabilities.


#### [Performance Benchmark - Luxun vs Apache Kafka](http://bulldog2011.github.io/blog/2013/04/19/performance-benchmark-luxun-vs-apache-kafka/)

> Luxun is a high-throughput, distributed, pub-sub messaging system tailored for big data collecting and analytics. Luxun is inspired by Apache Kafka, both have a similar architecture. 

The overall performance of Luxun is much better than Kafka:

> 1. In async producing mode, no matter whether flush is enabled or not, the throughput of Luxun is at least twice the throughput of Kafka.
> 2. In sync producing mode, if flush is disabled, Luxun performs much better than Kafka.
> 3. In sync producing mode, if flush is enabled, Luxun performs worse than Kafka.
> 4. In all consuming tests, Luxun performs much better than Kafka.

The primary cause for the difference in performance seems to be that Luxun uses memory-mapped files unlike Kafka.


#### [Kafka vs Solace](http://solacesystems.com/techblog/deconstructing-kafka)

Solace Messaging Appliance is a hardware message queue which has similar goals as Kafka. The blog post talks about goals and then presents a comparison of simple benchmarks on both Kafka and Solace. Solace is faster than Kafka by 7 to 9 times with guaranteed delivery enabled and 25 times more faster without guaranteed delivery!


----


Benchmarks
----------

#### [Official Performance Results (Kafka 0.7)](http://kafka.apache.org/07/performance.html)

Presents the test setup and various graphs showing the performance in Kafka in various scenarios (with nice graphs). The code which was used for this benchmarking is checked into the Kafka codebase.

#### [KAFKA 0.8 PRODUCER PERFORMANCE](http://blog.liveramp.com/2013/04/08/kafka-0-8-producer-performance-2/)

A very detailed blog post which explains performance benchmark done using the Kafka Java libraries (results corroborated against the Scala benchmark code from the Kafka codebase). Presents the setup and the results (including nice graphs) in various scenarios. Unfortunately there is no link to the code used for the benchmark. They draw some useful conclusions as well:

> * Kafka 0.8 improves availability and durability at the expense of some performance.
> * Throughput seems to scale very well as the number of brokers and/or disks per broker increases.
> * Moderate numbers of producer machines and topics have no negative effect on throughput compared to a single producer and topic.
> * When configured in async mode, producers have very low average latency for each message sent, but there are outliers that take over 100 ms, even when operating at low overall throughput. This poses a problem for our use case.
> * Trying to push more data than the brokers can handle for any sustained period of time has catastrophic consequences, regardless of what timeout settings are used. In our use case this means that we need to either ensure we have spare capacity for spikes, or use something on top of Kafka to absorb spikes.

#### [Horizontal Scalability](http://markmail.org/message/6illcsf6czpemjit#query:+page:1+mid:dwoyk2ule6ij4fib+state:results)

A blog post on the kafk-users mailing list showing off that Kafka's throughput had a near linear increase with addition of an additional server to the cluster.

***

Case Studies
------------

***

In-depth Understanding & Performance Tuning
-------------------------------------------

#### [Configuration Parameters](http://kafka.apache.org/08/configuration.html)

Official listing of tunable configurations for Broker, Producer and Consumer. Listed below are probably the most important ones from a performance tuning point-of-view:

**Broker**

* num.io.threads
    * You should have at least as many threads as you have disks.
* queued.max.requests

**Producer**

* producer.type
* request.required.acks
* compression.codec
* queue.buffering.max.ms
* queue.buffering.max.messages
* queue.enqueue.timeout.ms
* batch.num.messages

#### [Compression in Kafka: GZIP or Snappy?](http://geekmantra.wordpress.com/2013/03/28/compression-in-kafka-gzip-or-snappy/)

Discusses the performance impact of compression on Kafka in general and compares the relative impact between Gzip and Snappy compression. Benchmarking numbers are presented. It's also pointed out that this is a bigger concern in 0.8+ than 0.7 (due to a change in how offset is handled).

The important conclusion seems to be that Snappy is a better bet in terms of CPU usage and throughput of producers as well as consumers although Gzip is 30% more efficient in terms of data size.

#### Sync vs Async Producers

Kafka uses a **sync producer** by default i.e. messages are synchronously sent to the broker, blocking the calling thread until the broker returns. In this mode, the config parameter `request.required.acks` (default value `0`) determines how quickly the broker returns; the option is well [documented](http://kafka.apache.org/08/configuration.html). If compression is enabled (by setting the `compression.codec` config property) then compression is also done on the calling thread further impacting the performance.

The config property `producer.type` can be set to `async` to use an async producer instead of a sync producer. Async producers create in-memory queues in which messages are buffered; the queue size can be configured using `queue.buffering.max.messages`. Background threads (one per broker) then send the messages to the Kafka broker either after a fixed time interval (configured using `queue.buffering.max.ms`) or after a fixed number of messages (configured using `batch.num.messages`) are accumulated, whichever happens earlier. If the messages cannot be sent as fast as they are produced Async producers send the accumulated messages as a batch and this helps them achieve an overall higher throughput.

Summary:

* Sync producers provide better delivery guarantees (of varying degrees) but have higher latencies and can result in backpressure on the producing app.
* Async producers provide weaker delivery guarantees (can lead to data loss) but have lower latencies and can be configured to either put backpressure on producing app or drop data.

References:

1. [Official Config Options Documentation](http://kafka.apache.org/08/configuration.html)
2. [Understanding the Kafka Async Producer](http://engineering.gnip.com/kafka-async-producer/)


























