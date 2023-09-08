import { Schema } from "@nestjs/mongoose";

@Schema()
export class LegalDocument extends Document {
    // @Prop({required : true})
    filename

}