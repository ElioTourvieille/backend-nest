import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class KindeGuard implements CanActivate {
  // Initialize JWKS client to fetch public keys from Kinde
  private client = jwksClient({
    jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);


    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify and decode the JWT token
      const decoded = await this.verifyToken(token);
      // Attach user information to the request for use in controllers
      request.user = {
        id: decoded.sub,
        email: decoded.email,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Helper method to extract the Bearer token from the Authorization header
  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }

  // Verify the JWT token using Kinde's public key
  private async verifyToken(token: string): Promise<any> {
    // Decode the token first to get the key ID (kid)
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) throw new Error('Invalid token');

    // Get the public key corresponding to the key ID
    const key = await this.client.getSigningKey(decoded.header.kid);
    const publicKey = key.getPublicKey();

    // Verify the token signature and claims
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        publicKey,
        {
          algorithms: ['RS256'],
          issuer: process.env.KINDE_ISSUER_URL,
        },
        (err, decoded) => {
          if (err) reject(err);
          resolve(decoded);
        },
      );
    });
  }
} 