import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Calculator, 
  Shield, 
  Users, 
  FileText,
  TrendingUp,
  CheckCircle,
  Building,
  Clock,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accounting-surface/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-accounting-primary rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">RV Contabilidade</span>
              <p className="text-xs text-muted-foreground hidden sm:block">O seu escritório digital</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#solucoes" className="text-muted-foreground hover:text-foreground transition-colors">
              Soluções
            </a>
            <a href="#diferenciais" className="text-muted-foreground hover:text-foreground transition-colors">
              Diferenciais
            </a>
            <a href="#clientes" className="text-muted-foreground hover:text-foreground transition-colors">
              Para Clientes
            </a>
            <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Portal do Cliente
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-5 w-5 text-accounting-success" />
                <span className="text-sm font-medium text-accounting-success">Escritório Digital Certificado</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Gestão Contabilística
                <span className="text-accounting-primary block">Inteligente</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Transforme a gestão da sua empresa com o nosso escritório contabilístico digital. 
                Contabilidade moderna, segura e em conformidade com o SNC e normativo português.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-accounting-primary hover:bg-accounting-primary/90 text-lg px-8 py-4">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Users className="mr-2 h-5 w-5" />
                  Falar com Especialista
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-accounting-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Empresas atendidas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accounting-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Disponibilidade</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accounting-primary">24h</div>
                  <div className="text-sm text-muted-foreground">Suporte ativo</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-accounting-primary/10 to-accounting-secondary/10 rounded-3xl p-8 backdrop-blur-sm border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-accounting-success/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-accounting-success" />
                      </div>
                      <div>
                        <div className="font-semibold">Receita Mensal</div>
                        <div className="text-sm text-muted-foreground">Dezembro 2024</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-accounting-success">€ 85.340</div>
                      <div className="text-sm text-accounting-success">+12.5%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-accounting-warning/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-accounting-warning" />
                      </div>
                      <div>
                        <div className="font-semibold">Obrigações</div>
                        <div className="text-sm text-muted-foreground">Em dia</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <CheckCircle className="h-6 w-6 text-accounting-success ml-auto" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-accounting-secondary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-accounting-secondary" />
                      </div>
                      <div>
                        <div className="font-semibold">Empresas Ativas</div>
                        <div className="text-sm text-muted-foreground">Total gerenciadas</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">127</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solucoes" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Soluções Completas para a Sua Empresa
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Do empresário em nome individual às grandes empresas, oferecemos serviços contabilísticos especializados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-accounting-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-accounting-primary" />
                </div>
                <CardTitle>Contabilidade Digital</CardTitle>
                <CardDescription>
                  Escrituração completa, balancetes, demonstrações de resultados e todas as obrigações acessórias em ambiente 100% digital
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-accounting-success/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-accounting-success" />
                </div>
                <CardTitle>Compliance Fiscal</CardTitle>
                <CardDescription>
                  Gestão completa de obrigações fiscais, IES, declarações periódicas de IVA, IRC e acompanhamento automático de prazos da AT
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-accounting-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accounting-secondary" />
                </div>
                <CardTitle>Consultoria Estratégica</CardTitle>
                <CardDescription>
                  Análise de gestão, planeamento fiscal e orientação para crescimento sustentável do negócio
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-accounting-warning/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accounting-warning" />
                </div>
                <CardTitle>Gestão de Pessoal</CardTitle>
                <CardDescription>
                  Processamento salarial, Segurança Social, subsídios e todo o departamento de recursos humanos da sua empresa
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Constituição de Empresas</CardTitle>
                <CardDescription>
                  Processo completo de constituição empresarial, desde o NIPC até a primeira declaração
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Suporte 24/7</CardTitle>
                <CardDescription>
                  Atendimento especializado quando você precisar, com equipe dedicada ao seu sucesso
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section id="diferenciais" className="py-20 px-4 bg-accounting-surface/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Porquê escolher a RV Contabilidade?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnologia de ponta aliada à experiência de profissionais especializados
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accounting-success/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-accounting-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Plataforma Integrada</h3>
                  <p className="text-muted-foreground">
                    Tudo num só local: contabilidade, fiscal, pessoal e gestão em ambiente seguro e acessível
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accounting-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-accounting-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Automatização Inteligente</h3>
                  <p className="text-muted-foreground">
                    Processos automatizados que reduzem erros e aceleram a entrega de obrigações e relatórios
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accounting-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-accounting-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Segurança Certificada</h3>
                  <p className="text-muted-foreground">
                    Certificação digital, backup em nuvem e proteção total dos seus dados empresariais
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accounting-warning/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-accounting-warning" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Equipa Especializada</h3>
                  <p className="text-muted-foreground">
                    Contabilistas e consultores com certificações actualizadas em constante formação
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-accounting-primary/5 to-accounting-secondary/5 rounded-2xl p-8 border">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Transformação Digital</h3>
                <p className="text-muted-foreground">
                  Modernize a sua gestão contabilística e tenha controlo total do seu negócio
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <span className="font-medium">Redução de Custos</span>
                  <span className="text-accounting-success font-bold">até 40%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <span className="font-medium">Tempo de Processamento</span>
                  <span className="text-accounting-primary font-bold">75% menor</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <span className="font-medium">Satisfação do Cliente</span>
                  <span className="text-accounting-success font-bold">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accounting-primary to-accounting-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para Revolucionar a sua Contabilidade?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já transformaram a sua gestão contabilística connosco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Users className="mr-2 h-5 w-5" />
                Portal do Cliente
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-accounting-primary">
              <Calculator className="mr-2 h-5 w-5" />
              Área do Contabilista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-accounting-primary rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">RV Contabilidade</span>
                  <p className="text-sm text-muted-foreground">O seu escritório digital</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Transformando a gestão contabilística de empresas através da tecnologia e conhecimento profissional.
              </p>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <span>ROC n.º 1234</span>
                <span>•</span>
                <span>NIPC: 501.123.456</span>
                <span>•</span>
                <span>NIF: PT501123456</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-background transition-colors">Contabilidade Digital</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Gestão Fiscal</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Processamento Salarial</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Consultoria</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-background transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contacte-nos</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Termos de Utilização</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 RV Contabilidade. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
