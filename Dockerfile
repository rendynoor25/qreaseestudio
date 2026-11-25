FROM rust:1.98-bookworm AS builder
WORKDIR /build
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY web ./web
RUN cargo build --locked --release

FROM debian:bookworm-slim
COPY --from=builder /build/target/release/qreasee-studio /usr/local/bin/qreasee-studio
RUN mkdir /data && chown 65532:65532 /data
USER 65532:65532
ENV QREASEE_ADDR=0.0.0.0:8941 QREASEE_DATA=/data
VOLUME ["/data"]
EXPOSE 8941
ENTRYPOINT ["qreasee-studio"]
