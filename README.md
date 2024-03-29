# DNS Over HTTPS

Lightweight DNS over HTTPS (DoH) forwarder. It acts as an intermediary between
your applications and a DoH resolver.

dns packet

0         5  6  7  8         11             15
+---------------------------------------------+
|                       ID                    |
+---------------------------------------------|
| QR | Opcode | AA | TC | RD | RA | Z | RCODE |
+---------------------------------------------|
|                     QDCOUNT                 |
+---------------------------------------------|
|                     ANCOUNT                 |
+---------------------------------------------|
|                     NSCOUNT                 |
+---------------------------------------------|
|                     ARCOUNT                 |
+---------------------------------------------+


```shell
ID      -> 16 bit | A 16 bit identifier
```
```shell
QR      -> 1 bit | A one bit field that specifies whether this message is a query (0), or a response (1).
```
```shell
OPCODE  -> 4 bit | This value is set by the originator of a query and copied into the response. 
The values are:

0 a standard query (QUERY)
1 an inverse query (IQUERY)
2 a server status request (STATUS)
3-15 reserved for future use
```

```shell
AA      -> 1 bit | Authoritative Answer - this bit is valid in responses, and specifies that the responding name server is an authority for the domain name in question section.
```

```shell
TC      -> 1 bit | TrunCation - specifies that this message was truncated due to length greater than that permitted on the transmission channel.
```

```shell
RD      -> 1 bit | Recursion Desired - this bit may be set in a query and is copied into the response. If RD is set, it directs the name server to pursue the query recursively. Recursive query support is optional.
```

```shell
RA      -> 1 bit | Recursion Available - this be is set or cleared in a response, and denotes whether recursive query support is available in the name server.
```

```shell
Z       -> 3 bit | Reserved for future use. Must be zero in all queries and responses.
```

```shell
RCODE   -> 4 bit | Response code - this 4 bit field is set as part of responses. The values have the following interpretation:

0: No error condition
1: Format error - The name server was unable to interpret the query.
2: Server failure - The name server was unable to process this query due to a problem with the name server.
3: Name Error - Meaningful only for responses from an authoritative name server, this code signifies that the domain name referenced in the query does not exist.
4: Not Implemented - The name server does not support the requested kind of query.
5: Refused - The name server refuses to perform the specified operation for policy reasons. For example, a name server may not wish to provide the information to the particular requester, or a name server may not wish to perform a particular operation (e.g., zone transfer) for particular data.
6-15: Reserved for future use.
```

```shell
QDCOUNT -> 16 bit | An unsigned 16 bit integer specifying the number of entries in the question section.
```
```shell
ANCOUNT -> 16 bit | An unsigned 16 bit integer specifying the number of resource records in the answer section.
```
```shell
NSCOUNT -> 16 bit | An unsigned 16 bit integer specifying the number of name server resource records in the authority records section.
```
```shell
ARCOUNT -> 16 bit | An unsigned 16 bit integer specifying the number of resource records in the additional records section.
```

### Ressources

- [huawei](https://support.huawei.com/enterprise/en/doc/EDOC1100174721/f917b5d7/dns)
- [ietf](https://datatracker.ietf.org/doc/html/rfc8484)
- [cloudflare](https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/)
