import * as sharp from "sharp";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CropImageHelper {
  private image: sharp.Sharp | null = null;
  private sideLength: number | null = null;

  static fromBuffer(imageBuffer: Buffer): CropImageHelper {
    const processor = new CropImageHelper();
    processor.image = sharp(imageBuffer);
    return processor;
  }

  async cropToSquare(): Promise<CropImageHelper> {
    if (!this.image) throw new Error("Imagem não foi carregada.");

    const metadata = await this.image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Falha ao obter as dimensões da imagem.");
    }

    this.sideLength = Math.min(metadata.width, metadata.height);

    this.image = this.image.extract({
      width: this.sideLength,
      height: this.sideLength,
      left: 0,
      top: 0,
    });

    return this;
  }

  resize(width: number, height: number): CropImageHelper {
    if (!this.image) throw new Error("Imagem não foi carregada.");

    this.image = this.image.resize(width, height);
    return this;
  }

  changeColor(color: any): CropImageHelper {
    if (!this.image) throw new Error("Imagem não foi carregada.");

    this.image = this.image.tint(color);
    return this;
  }

  grayscale(): CropImageHelper {
    if (!this.image) throw new Error("Imagem não foi carregada.");

    this.image = this.image.grayscale();
    return this;
  }

  async toBuffer(): Promise<Buffer> {
    if (!this.image) throw new Error("Imagem não foi carregada.");
    return await this.image.toBuffer();
  }
}
