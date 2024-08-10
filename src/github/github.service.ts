import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'src/interfaces/repo.github';

@Injectable()
export class GithubService {
  //TO_DO - Implementação env
  private readonly GITHUB_API_URL = 'https://api.github.com';
  private readonly USER = 'takenet';
  private readonly LANGUAGE = 'C#';

  constructor(private readonly httpService: HttpService) {}

  async getOldestCSharpRepos(): Promise<any[]> {
    const url = `${this.GITHUB_API_URL}/users/${this.USER}/repos?per_page=100`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const repos: Repository[] = response.data
        .filter((repo: Repository) => repo.language === this.LANGUAGE)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        .slice(0, 5);

      return repos;
    } catch (error) {
      throw new Error('Failed to fetch repositories');
    }
  }
}
