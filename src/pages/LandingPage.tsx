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
  Clock,
  Award,
  UserCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  SplitText, 
  ShinyText,
  BlurText,
  CountUp,
  FadeInUpNew,
  ScaleInNew,
  Magnetic,
  AnimatedBackground,
  GradientOrb
} from "@/components/animations";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-background relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground particleCount={15} />
      
      {/* Gradient Orbs */}
      <GradientOrb size="lg" className="top-10 -left-32" />
      <GradientOrb size="md" className="top-1/2 -right-24" color="blue" />
      <GradientOrb size="sm" className="bottom-20 left-1/4" color="green" />
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
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
              <FadeInUpNew>
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Contabilista Certificada • ROC n.º 1234</span>
                </div>
              </FadeInUpNew>
              
              <div className="mb-6">
                <FadeInUpNew>
                  <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                    Deixe a sua contabilidade em boas mãos
                  </h1>
                </FadeInUpNew>
                <div className="mt-2">
                  <ShinyText
                    text="Concentre-se no que realmente importa"
                    className="text-2xl md:text-3xl font-semibold block text-blue-600"
                    background="linear-gradient(110deg, #3B82F6 45%, #60A5FA 55%, #3B82F6 65%)"
                    animationSpeed={2.5}
                  />
                </div>
              </div>
              
              <FadeInUpNew delay={0.3}>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  <strong className="text-foreground">IRS sem complicações.</strong> Empresas organizadas e em dia. 
                  Atendimento personalizado para particulares e negócios de todos os tamanhos. 
                  <span className="text-blue-600 font-semibold">A sua tranquilidade fiscal é a nossa prioridade.</span>
                </p>
              </FadeInUpNew>
              <ScaleInNew delay={0.5}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register-extended">
                    <Magnetic intensity={0.2}>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-600/90 text-lg px-8 py-4 relative overflow-hidden group">
                        <span className="relative z-10">Peça o Seu Orçamento Grátis</span>
                        <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </Magnetic>
                  </Link>
                  <Magnetic intensity={0.15}>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4 hover:bg-blue-600/5 hover:border-blue-600 transition-all duration-300">
                      <Users className="mr-2 h-5 w-5" />
                      Falar Diretamente Comigo
                    </Button>
                  </Magnetic>
                </div>
              </ScaleInNew>
              <FadeInUpNew delay={0.7}>
                <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      <CountUp to={150} suffix="+" duration={2.5} />
                    </div>
                    <div className="text-sm text-muted-foreground">Clientes satisfeitos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      <CountUp to={15} suffix=" anos" duration={2.5} />
                    </div>
                    <div className="text-sm text-muted-foreground">De experiência</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      <CountUp to={100} suffix="%" duration={2.5} />
                    </div>
                    <div className="text-sm text-muted-foreground">Prazos cumpridos</div>
                  </div>
                </div>
              </FadeInUpNew>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-3xl p-8 backdrop-blur-sm border">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">O que os meus clientes dizem:</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-background rounded-xl shadow-sm">
                    <div className="h-10 w-10 bg-green-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-600">MJ</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Maria João Silva</div>
                      <div className="text-xs text-muted-foreground mb-2">Empresária • Comércio</div>
                      <p className="text-sm text-muted-foreground">"Finalmente posso dormir descansada. A Rita trata de tudo com um profissionalismo exemplar."</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-background rounded-xl shadow-sm">
                    <div className="h-10 w-10 bg-blue-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">PA</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Paulo Andrade</div>
                      <div className="text-xs text-muted-foreground mb-2">Particular • IRS</div>
                      <p className="text-sm text-muted-foreground">"IRS entregue em 2 dias! Nunca foi tão fácil. Recomendo a toda a gente."</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-background rounded-xl shadow-sm">
                    <div className="h-10 w-10 bg-cyan-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-cyan-600">AC</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Ana Costa</div>
                      <div className="text-xs text-muted-foreground mb-2">Freelancer • Recibos Verdes</div>
                      <p className="text-sm text-muted-foreground">"Apoio constante e preços justos. A melhor decisão que tomei para o meu negócio."</p>
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
            <SplitText
              text="Tudo o que precisa para estar tranquilo"
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              delay={80}
              splitType="words"
            />
            <FadeInUpNew delay={0.3}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Seja particular ou empresário, tenho a solução certa para si. 
                <strong className="text-foreground">Sem complicações, sem stress.</strong>
              </p>
            </FadeInUpNew>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScaleInNew delay={0.1}>
              <Magnetic intensity={0.1}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calculator className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>IRS Sem Complicações</CardTitle>
                    <CardDescription>
                      <strong>Entregue o seu IRS em 48h.</strong> Máximo reembolso garantido. 
                      Atendimento personalizado e preços transparentes. Deixe tudo comigo!
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Magnetic>
            </ScaleInNew>

            <ScaleInNew delay={0.2}>
              <Magnetic intensity={0.1}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>Empresas Sempre em Dia</CardTitle>
                    <CardDescription>
                      <strong>Zero multas, zero stress.</strong> IVA, IRC, declarações anuais - tudo tratado nos prazos. 
                      Acompanhamento mensal incluído. A sua empresa segura e organizada.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Magnetic>
            </ScaleInNew>

            <ScaleInNew delay={0.3}>
              <Magnetic intensity={0.1}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <div className="w-12 h-12 bg-cyan-600/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6 text-cyan-600" />
                    </div>
                    <CardTitle>Recibos Verdes Simplificados</CardTitle>
                    <CardDescription>
                      <strong>Freelancer ou prestador de serviços?</strong> Categoria certa, pagamentos organizados, 
                      IVA sem dores de cabeça. Foque-se no seu trabalho, eu trato do resto.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Magnetic>
            </ScaleInNew>

            <ScaleInNew delay={0.4}>
              <Magnetic intensity={0.1}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-amber-500" />
                    </div>
                    <CardTitle>Contabilidade Organizada</CardTitle>
                    <CardDescription>
                      <strong>A sua empresa merece crescer.</strong> Relatórios claros, análise de custos, 
                      conselhos práticos para aumentar lucros. Contabilidade que faz a diferença.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Magnetic>
            </ScaleInNew>

            <ScaleInNew delay={0.5}>
              <Magnetic intensity={0.1}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle>Apoio na Criação de Empresa</CardTitle>
                    <CardDescription>
                      <strong>Sonha ser patrão?</strong> Ajudo-o a criar a sua empresa do zero. 
                      Escolha da forma jurídica, registo, primeiras obrigações. Comece bem!
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Magnetic>
            </ScaleInNew>

            <ScaleInNew delay={0.6}>
              <Magnetic intensity={0.1}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Clock className="h-6 w-6 text-pink-600" />
                    </div>
                    <CardTitle>Sempre Disponível Para Si</CardTitle>
                    <CardDescription>
                      <strong>Tem uma dúvida urgente?</strong> Contacte-me por telefone, email ou WhatsApp. 
                      Resposta rápida e atendimento humanizado. Está em boas mãos.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Magnetic>
            </ScaleInNew>
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section id="diferenciais" className="py-20 px-4 bg-blue-50/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <BlurText
              text="Porque é que me deve escolher?"
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              delay={100}
              animateBy="words"
            />
            <FadeInUpNew delay={0.5}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                <strong className="text-foreground">Rita Vieira, Contabilista Certificada.</strong> 
                Mais de 15 anos a ajudar particulares e empresas a estarem sempre em dia com o fisco.
              </p>
            </FadeInUpNew>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Atendimento 100% Personalizado</h3>
                  <p className="text-muted-foreground">
                    <strong>Conheço todos os meus clientes pelo nome.</strong> Não é mais um número numa empresa gigante. 
                    Aqui tem atenção dedicada e soluções à medida das suas necessidades.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Preços Justos e Transparentes</h3>
                  <p className="text-muted-foreground">
                    <strong>Sem surpresas na fatura.</strong> Orçamento gratuito e preços fixos acordados antecipadamente. 
                    Qualidade profissional sem pagar de mais.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-cyan-600/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Experiência e Confiança</h3>
                  <p className="text-muted-foreground">
                    <strong>Mais de 15 anos de experiência.</strong> Centenas de IRS entregues, dezenas de empresas acompanhadas. 
                    Zero multas dos meus clientes. Os resultados falam por si.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Rapidez e Eficiência</h3>
                  <p className="text-muted-foreground">
                    <strong>IRS em 48h, empresas sempre em dia.</strong> Tecnologia moderna ao serviço da rapidez. 
                    Não perca tempo nem prazos importantes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/5 to-cyan-500/5 rounded-2xl p-8 border">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">Garantias que Ofereço</h3>
                <p className="text-muted-foreground">
                  <strong>A sua tranquilidade é a minha prioridade.</strong> Por isso ofereço garantias concretas.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <span className="font-medium">Prazo IRS Particular</span>
                  <span className="text-green-600 font-bold">48 horas</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <span className="font-medium">Prazos Fiscais Cumpridos</span>
                  <span className="text-blue-600 font-bold">100%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <span className="font-medium">Clientes Satisfeitos</span>
                  <span className="text-green-600 font-bold">99%</span>
                </div>
                <div className="mt-6 p-4 bg-blue-600/10 rounded-lg text-center">
                  <p className="text-sm font-semibold text-blue-600">
                    💡 Primeira consulta sempre gratuita!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 relative">
        <div className="container mx-auto text-center relative z-10">
          <ShinyText
            text="Não deixe para depois — simplifique hoje mesmo!"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            background="linear-gradient(110deg, #ffffff 45%, #e0e7ff 55%, #ffffff 65%)"
            animationSpeed={3}
          />
          <FadeInUpNew delay={0.3}>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              <strong>Mais de 150 pessoas já confiaram em mim.</strong> 
              Seja o próximo a dormir descansado sabendo que está tudo em ordem.
            </p>
          </FadeInUpNew>
          <ScaleInNew delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register-extended">
                <Magnetic intensity={0.2}>
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-white/90 hover:scale-105 transition-all">
                    <UserCircle className="mr-2 h-5 w-5" />
                    Quero o Meu Orçamento Grátis
                  </Button>
                </Magnetic>
              </Link>
              <Link to="/login">
                <Magnetic intensity={0.15}>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-all bg-transparent">
                    Já sou cliente
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Magnetic>
              </Link>
            </div>
          </ScaleInNew>
          <FadeInUpNew delay={0.7}>
            <p className="text-white/70 text-sm mt-4">
              ✅ Orçamento gratuito • ✅ Primeira consulta sem compromisso • ✅ Resposta em 24h
            </p>
          </FadeInUpNew>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
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
