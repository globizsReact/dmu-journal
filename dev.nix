{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-16_x        # Node.js (ensure this matches your version)
    pkgs.libressl_3_6.bin   # LibreSSL for SSL/TLS support
  ];
}
