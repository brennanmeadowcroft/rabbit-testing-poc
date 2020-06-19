# RabbitMQ Testing POC

This repo demonstrates running automated tests against a service that accepts responses via RabbitMQ. This allows for testing code against either a local version of RabbitMQ or within a CI pipeline using Docker Compose and does not require a _deployed_ instance.

## Running the POC

1. Run the entire test suite in Docker Compose: `npm run test:docker-compose`

This will startup the service, RabbitMQ and run the tests inside Docker Compose. When the tests complete, the containers will shut down.

**💡Note:** Logging is turned off entirely for Rabbit and minimized for the service to keep the noise down and make it easier to see the results of testing. This can be changed if needed, see [Logging](#logging)

### Forcing a failed test

To view the behavior when a test fails, change the `INCLUDE_FAIL` environment variable under the testing section in `docker-compose.yml` as follows:

```yaml
environment:
  # All other variables remain the same
  INCLUDE_FAIL: 1
```

The tests will fail and the container will exit with a non-zero exit code which, under normal circumstances, would cause a CI pipeline to fail.

**Reminder:** The default value for `INCLUDE_FAIL` is `0`.

## Clean Up

Run `npm run docker:clean` to remove old containers and delete the images built by the POC.

## Testing

The tests maintain a Rabbit client that can be used to abstract out the request and response so it can be easily managed by the test suite. An alternative would be to use a Rabbit client maintained by the code but this runs the risk of having tests be too coupled to code level implementations so it was avoided in this case.

Tests pass a message to the service through Rabbit and then listen for the response which it can then validate. No changes are required to the service in order to test it.

## Logging

### Application

You can follow along with the process in the service by setting `LOG_LEVEL` in `docker-compose.yml` to either `debug`, `info`, `error`. The default is error and is the _least_ verbose.

### Rabbit

Logs can be enabled for Rabbit by removing the following lines from the Rabbit section in `docker-compose.yml`:

```yaml
logging:
  driver: none
```

## Wait-For-It

This is a small script that allows for some docker images to depend on the existence of others before proceeding. It does not impact the functionality of the POC.
