# Ensure the script stops on errors
$ErrorActionPreference = "Stop"

try {
    # 1. Restaurar o index.html limpo a partir do modelo base
    Write-Host "Restaurando index.html limpo..." -ForegroundColor Yellow
    Copy-Item -Force "index.base.html" "index.html"

    # 2. Build do projeto
    Write-Host "Buildando projeto com Vite..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro no build. Verifique seu código." -ForegroundColor Red
        exit
    }

    # 3. Copiar arquivos do dist/ para a raiz
    Write-Host "Copiando arquivos do dist/ para a raiz..." -ForegroundColor Yellow
    Copy-Item -Recurse -Force dist\* .\

    # 4. Git commit & push para gh-pages
    Write-Host "Fazendo commit e push para gh-pages..." -ForegroundColor Green
    git add .
    git commit -m "Deploy automático via script"
    git push origin gh-pages

    Write-Host "Deploy finalizado com sucesso! 🚀" -ForegroundColor Green

} catch {
    Write-Host "Erro inesperado: $_" -ForegroundColor Red
}
