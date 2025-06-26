import { AiClientInterface } from 'src/domain/repositories/ai-client.interface';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MistralLocalClientService implements AiClientInterface {
  private readonly logger = new Logger(MistralLocalClientService.name);

async extractStructuredDataFromText(text: string): Promise<any[]> {
 const prompt = `Voici un texte extrait d'un PDF :\n${text}\n\n
Peux-tu extraire les données pertinentes dans un tableau JSON clair, avec les champs correspondants ?`;
  try {
    const res = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt,
      stream: false,
    });

    const data = res.data as { response: string };
    const raw = data.response;
    this.logger.log('Réponse brute de Mistral : ' + raw);

    // Extraction du JSON entre les balises ```json ... ```
    const match = raw.match(/```json\s*([\s\S]*?)```/i);
    const jsonString = match ? match[1] : raw; // Si pas de balises, tente de parser tout

    return JSON.parse(jsonString);
  } catch (error) {
    this.logger.error('Erreur lors de l’extraction IA :', error.message);
    return [];
  }
}
}
